import { useState } from "react";
import { getGuestByPhone } from "../../services/FeedbackServices";

export const useGuestAutoFill = (setFormData, setToastMessage) => {
  const [hasLookedUp, setHasLookedUp] = useState(false);

  const checkGuestByPhone = async (phone) => {
    try {
      const res = await getGuestByPhone(phone);
      if (res?.data) {
        const guest = res.data;
        setToastMessage(`Welcome back, ${guest.guestname}!`);
        setFormData((prev) => ({
          ...prev,
          name: guest.guestname || "",
          email: guest.guestemail || "",
          id: guest.guestcard || "",
        }));
      }
    } catch {
      // silent fail
    }
  };

  return { hasLookedUp, setHasLookedUp, checkGuestByPhone };
};
