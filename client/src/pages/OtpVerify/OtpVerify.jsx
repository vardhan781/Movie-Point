import { useState, useContext } from "react";
import { MovieContext } from "../../Context/MovieContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./OtpVerify.css";

const OtpVerify = () => {
  const { backendUrl } = useContext(MovieContext);
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!email || !otp) return toast.error("Email and OTP required");

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        email,
        otp,
      });
      toast.success(res.data.message);
      navigate("/auth");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return toast.error("Email required to resend OTP");
    try {
      await axios.post(`${backendUrl}/api/user/resend-otp`, { email });
      toast.success("OTP resent successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Resend OTP failed");
    }
  };

  return (
    <div className="otp-container">
      <h2>Verify Your Email</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        disabled
        readOnly
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      <button onClick={handleResend} className="resend-btn">
        Resend OTP
      </button>
    </div>
  );
};

export default OtpVerify;
