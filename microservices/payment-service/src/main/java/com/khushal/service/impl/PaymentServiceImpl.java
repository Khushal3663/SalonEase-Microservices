package com.khushal.service.impl;

import com.khushal.domain.PaymentMethod;
import com.khushal.domain.PaymentOrderStatus;
import com.khushal.messaging.BookingEventProducer;
import com.khushal.messaging.NotificationEventProducer;
import com.khushal.model.PaymentOrder;
import com.khushal.payload.dto.BookingDTO;
import com.khushal.payload.dto.UserDTO;
import com.khushal.payload.response.PaymentLinkResponse;
import com.khushal.repository.PaymentOrderRepository;
import com.khushal.service.PaymentService;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentOrderRepository paymentOrderRepository;
    private final BookingEventProducer bookingEventProducer;
    private final NotificationEventProducer notificationEventProducer;

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Value("${razorpay.api.key}")
    private String razorpayApiKey;

    @Value("${razorpay.api.secret}")
    private String razorpayApiSecret;

    @Value("${payment.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public PaymentLinkResponse createOrder(UserDTO user, BookingDTO booking, PaymentMethod paymentMethod) throws RazorpayException, StripeException {
        Long amount = (long)booking.getTotalPrice();

        PaymentOrder order = new PaymentOrder();
        order.setAmount(amount);
        order.setPaymentMethod(paymentMethod);
        order.setBookingId(booking.getId());
        order.setSalonId(booking.getSalonId());
        order.setUserId(user.getId());

        PaymentOrder savedOrder = paymentOrderRepository.save(order);

        PaymentLinkResponse paymentLinkResponse = new PaymentLinkResponse();

        if(paymentMethod.equals(PaymentMethod.RAZORPAY)){
            PaymentLink payment = createRazorpayPaymentLink(user, savedOrder.getAmount(), savedOrder.getId());

            String paymentUrl = payment.get("short_url");
            String paymentUrlId = payment.get("id");

            paymentLinkResponse.setPaymentLinkUrl(paymentUrl);
            paymentLinkResponse.setPaymentLinkId(paymentUrlId);

            savedOrder.setPaymentLinkId(paymentUrlId);

            paymentOrderRepository.save(savedOrder);
        }
        else{
            String paymentUrl = createStripePaymentLink(user, savedOrder.getAmount(), savedOrder.getId());
            paymentLinkResponse.setPaymentLinkUrl(paymentUrl);
        }
        return paymentLinkResponse;
    }

    @Override
    public PaymentOrder getPaymentOrderById(Long id) throws Exception {
        PaymentOrder paymentOrder = paymentOrderRepository.findById(id).orElse(null);
        if(paymentOrder == null){
            throw new Exception("payment order not found");
        }
        return paymentOrder;
    }

    @Override
    public PaymentOrder getPaymentOrderByPaymentId(String paymentId) {
        return paymentOrderRepository.findByPaymentLinkId(paymentId);
    }

    @Override
    public PaymentLink createRazorpayPaymentLink(UserDTO user, Long amount, Long orderId) throws RazorpayException {
        amount = amount * 100;

        RazorpayClient razorpayClient = new RazorpayClient(razorpayApiKey, razorpayApiSecret);
        JSONObject paymentLinkRequest = new JSONObject();
        paymentLinkRequest.put("amount", amount);
        paymentLinkRequest.put("currency", "INR");

        JSONObject customer = new JSONObject();
        customer.put("name", user.getFullName());
        customer.put("email", user.getEmail());

        paymentLinkRequest.put("customer", customer);

        JSONObject notify = new  JSONObject();
        notify.put("email", true);

        paymentLinkRequest.put("notify", notify);
        paymentLinkRequest.put("reminder_enable", true);
        paymentLinkRequest.put("callback_url", frontendUrl + "/payment-success/" + orderId);
        paymentLinkRequest.put("callback_method", "get");

        return razorpayClient.paymentLink.create(paymentLinkRequest);
    }


    @Override
    public String createStripePaymentLink(UserDTO user, Long amount, Long orderId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;
        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/payment-success/" + orderId)
                .setCancelUrl(frontendUrl + "/payment-cancel/")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("usd")
                                .setUnitAmount(amount*100)
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName("salon appoinment booking")
                                        .build())
                                .build())
                        .build())
                .build();

        Session session = Session.create(params);
        return session.getUrl();
    }

    @Override
    public Boolean proceedPayment(PaymentOrder paymentOrder, String paymentId, String paymentLinkId) throws RazorpayException {

        // 1. Check if the status is already SUCCESS (Status 1 in DB)
        if (paymentOrder.getStatus().equals(PaymentOrderStatus.SUCCESS)) {
            return true;
        }

        if(paymentOrder.getStatus().equals(PaymentOrderStatus.PENDING)){
            if(paymentOrder.getPaymentMethod().equals(PaymentMethod.RAZORPAY)){
                RazorpayClient razorpayClient = new RazorpayClient(razorpayApiKey, razorpayApiSecret);

                Payment payment = razorpayClient.payments.fetch(paymentId);
                Integer amount = payment.get("amount");
                String status = payment.get("status");

                if(status.equals("captured")){
//                    produce  event
                    bookingEventProducer.sendBookingUpdateEvent(paymentOrder);
                    notificationEventProducer.sendNotificationEvent(paymentOrder.getBookingId(), paymentOrder.getUserId(), paymentOrder.getSalonId());

                    paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                    paymentOrderRepository.save(paymentOrder);
                    return true;
                }
                return false;
            }
            else{
                paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                paymentOrderRepository.save(paymentOrder);
                return true;
            }
        }

        return false;
    }
}
