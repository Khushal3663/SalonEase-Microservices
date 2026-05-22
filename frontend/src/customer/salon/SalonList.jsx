import React, { useEffect } from "react";
import SalonCard from "./SalonCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllSalons } from "../../redux/salonSlice";

const SalonList = () => {
  const dispatch = useDispatch();
  const { jwt, user } = useSelector((state) => state.auth);
  const { salons } = useSelector((state) => state.salon);

  useEffect(() => {
    dispatch(getAllSalons());
  }, [jwt, dispatch]);
  return (
    <div className="flex gap-5 flex-wrap">
      {salons.map((salon) => (
        <SalonCard salon={salon} />
      ))}
    </div>
  );
};

export default SalonList;
