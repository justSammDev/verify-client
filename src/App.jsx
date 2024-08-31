import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VerificationCodeInput = () => {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 1500);
  }, [error]);

  const handleChange = (index, e) => {
    if (isNaN(e.target.value)) {
      setError("Please enter a number.");
      return;
    }

    const newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);
    const focusedInput = e.target.parentNode.querySelector("input:focus");
    if (e.target.value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && e.target.previousSibling) {
      setTimeout(() => {
        e.target.previousSibling.focus();
      }, 0);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, code.length)
      .split("");
    const newCode = [...code];
    pastedData.forEach((digit, index) => {
      if (index < 6 && !isNaN(digit)) {
        newCode[index] = digit;
      }
    });
    setCode(newCode);
    const lastInput = e.target.parentNode.querySelector(
      "input[type='text']:last-child"
    );
    if (lastInput) {
      lastInput.focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit code.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_NAME}/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: verificationCode }),
        }
      );

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      navigate("/success");
    } catch (err) {
      setError("Verification Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#101010]">
      <div className="bg-[#171718] p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-300 font-[Exo]">
          Enter Verification Code
        </h1>
        <div className="flex mb-4">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(e)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-2xl text-center border border-gray-300 rounded mx-1 focus:outline-none focus:border-teal-500 font-[Exo]"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className={`w-full bg-[#adadc2] ${
            loading ? "cursor-not-allowed" : "cursor-pointer"
          } text-[#0d0f11] font-[Exo] py-2 rounded hover:bg-[#938daa] transition duration-200`}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
        <div className="w-full flex items-center justify-around mt-2 gap-4">
          <a
            className=" bg-[#adadc2] text-[#0d0f11] font-[Exo] py-2 flex-1 text-center rounded hover:bg-[#938daa] transition duration-200"
            target="_blank"
            href="https://github.com/justSammDev/verify-client"
          >
            Cient code
          </a>
          <a
            className=" bg-[#adadc2] text-[#0d0f11] font-[Exo] py-2 flex-1 text-center rounded hover:bg-[#938daa] transition duration-200"
            target="_blank"
            href="https://github.com/justSammDev/verify-server"
          >
            Server code
          </a>
        </div>

        {error && (
          <p className="mt-4 text-center font-[Exo] text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};

export default VerificationCodeInput;
