# 🗺️ SalonEase: End-to-End Visual Feature Walkthrough

This document tracks the complete distributed transactional flow of the SalonEase ecosystem—following a user from initial landing, through individual domain microservice queries, into unified payment processing, and final asynchronous message notification resolution.

---

### 🏠 1. The Landing Experience & Salon Discovery

When a authenticated client logs into the ecosystem via our identity router, they are met with a responsive landing experience aggregating active domain services from across the catalog.

#### Home Page Banner

![Landing Hero](.github/images/home-page-1.png)

#### Interactive Service Aggregators

Clients can instantly browse specific service types via categorization filters mapped directly to database classifications.
![Service Categories](.github/images/home-page-2.png)

#### Geo-Located/Named Salon Discoverability Grid

Cards dynamically display registered salon storefront branches, complete with star ratings and localized addresses.
![Salon Registry Layout](.github/images/home-page-salon-list.png)

---

### 🤝 1.5 Guest Landing & B2B Partner Onboarding Flow

Before authenticating, guest users encounter a call-to-action landing space. Unregistered salon entrepreneurs can access a dedicated, multi-step onboarding wizard managed by the `user` and `salon` registration microservices.

#### Public-Facing Guest Home Page (Unauthenticated State)

Features prominent entry funnels for users to explore or instantly register their business nodes.
![Guest Home Page Layout](.github/images/home-page-no-login.png)

#### Multi-Step Onboarding Form: Step 1 — Personal & Account Details

Captures primary stakeholder records, establishing core account credentials with underlying backend validation.
![Partner Onboarding Step 1](.github/images/become-partner-form-owner-details-tab.png)

#### Multi-Step Onboarding Form: Step 2 — Business Profile Mapping

Captures specific domain branding metadata, establishing operating window timeframes, slots, and helpline points.
![Partner Onboarding Step 2](.github/images/become-partner-form-salon-details.png)

#### Multi-Step Onboarding Form: Step 3 — Geolocation & Address Indexing

Enables business owners to input physical coordinates and mailing specifics to seed geographic queries in the salon database engine.
![Partner Onboarding Step 3](.github/images/become-partner-form-salon-address.png)

---

### 🛒 2. Dynamic Slot Reservation & Cart Checkout

Once an application user selects a specific studio location, the `salon` and `service-offering` microservices resolve components into an interactive booking cart.

#### Unified Storefront Header View

![Salon Banner](.github/images/salon-page.png)

#### Interactive Service Cart Management

Users can bundle multiple offerings (e.g., Haircut + Hair Color) into a single unified transaction. The sidebar updates calculations instantly.
![Booking Cart Layout](.github/images/salon-service-selection.png)

#### Centralized Temporal Slot Resolution

A calendar picker communicates directly with backend availability states to safely isolate conflict-free calendar dates.
![Calendar Picker Modal](.github/images/salon-slot-selection.png)

#### Double-Check Booking Intent Validation

![Booking Confirmation State](.github/images/salon-booking-confirm.png)

---

### 💳 3. Secure Enterprise Gateway Payments

When the client confirms their slot reservation, the `booking` container fires a payment request. The `payment` microservice communicates securely over external web protocols to hand off checkout control.

#### Third-Party Razorpay Checkout Portal Integration

Securely processing native currency amounts based on unified microservice checkouts.
![Razorpay Payment Frame](.github/images/salon-payment-razorpay.png)

#### Real-Time Transaction Completion Response

Upon completion of the redirect webhook handshakes, the application displays an instantaneous green success panel verifying transaction logging.
![Success Page Redirect View](.github/images/salon-payment-success-page.png)

---

### 🗄️ 4. Platform Metadata Footer

![Footer System Info](.github/images/home-page-footer.png)

---

### 👤 5. Customer Profile Account Space & Social Proof

Once appointments are safely processed, users gain localized command centers to track service histories, receive system alerts, and push feedback into the social ecosystem.

#### Unified "My Bookings" Ledger

Tracks complete transactional state histories, detailing assigned dates, times, localized pricing packages, and current verification badges.
![Customer Bookings Dashboard](.github/images/salon-my-bookings-page.png)

#### Real-Time Notification Center

Displays asynchronous system updates generated instantly via our decoupled RabbitMQ broker mesh.
![Customer Notifications Panel](.github/images/salon-customer-notification-page.png)

#### Centralized Salon Reviews Board

Aggregated community sentiment scoring mapped directly to the active salon cluster node.
![Reviews Feed Layout](.github/images/salon-reviews-page.png)

#### Dynamic Sentiment Feedback Form

Allows clients to submit customized star ratings and detailed descriptions to update database social fields.
![Create Review Modal Layout](.github/images/salon-create-review-form.png)

---

### 📊 6. Executive Salon Owner Analytics Panel

When an authenticated Salon Admin or Manager logs into the ecosystem, they bypass standard consumer routing entirely to access a dashboard reporting on revenue curves and metrics.

#### Financial Analytics & Revenue Trends

Provides data visualization of localized income curves using sleek graphical metrics.
![Owner Dashboard Revenue Chart](.github/images/salon-owner-dashboard-revenue-chart.png)

#### Temporal Booking Frequency Distribution

Plots booking clusters across hours to optimize salon staff scheduling.
![Booking Frequency Chart View](.github/images/salon-owner-dashboard-booking-frequency-chart.png)

#### Comprehensive Business Bookings Log

A global master console giving salon owners direct administration power over incoming customer reservations.
![Owner Bookings Log Control](.github/images/salon-owner-total-bookings.png)

#### Dynamic Service Inventory Catalog

Lists available options with explicit configurations for prices and durations.
![Service Offerings Inventory](.github/images/salon-owner-services-offered.png)

#### Granular Offerings Creator Form

A clean interface ensuring validation checks are performed on price inputs and category mappings.
![Add Service Module Interface](.github/images/salon-owner-create-new-service-form.png)

#### Centralized Business Payments Audit Trail

Tracks every transaction flowing into the specific salon branch.
![Owner Financial Auditing Panel](.github/images/salon-owner-payment-tab.png)

#### Granular Transaction Ledger View

Provides deep-dive invoice tracking, complete with exact checkout time markers, status codes, and user details.
![Owner Transaction Auditing Console](.github/images/salon-owner-transaction-tab.png)

#### Service Category Matrix

Allows branch admins to oversee active service groupings (e.g., Hair Cut, Massage Therapy) linked directly to downstream catalog microservices.
![Owner Categories Catalog Management](.github/images/salon-owner-categories.png)

#### Dynamic Category Configuration Wizard

Interface allowing immediate creation of fresh business classification models.
![Create Category Form Module](.github/images/salon-owner-create-category-form.png)

#### B2B Operational Alert Streams

The business-facing notification log tracking real-time status signals sent across the message lines.
![Owner Business Notification Stream](.github/images/salon-owner-all-notifications.png)

#### Admin Account Profile Hub

The centralized station where business owners manage security parameters, branch operation timings, and physical storefront location coordinates.
![Owner Store Profile Dashboard](.github/images/salon-owner-account-profile.png)

---

## 🏁 Walkthrough Complete

You have successfully explored the entire end-to-end user and provider lifecycle workflows of **SalonEase**.

For questions regarding inner API routing rules, Eureka connection policies, or custom environment overrides, please refer directly back to the [Core System Architecture README ➔](./README.md).
