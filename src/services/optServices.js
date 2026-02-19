import Otp from "../models/Otp";

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


export const saveOtp = async (email, otp) => {
  await Otp.deleMany({email});

  const expiresAt = new Date(Date.now() + 5 * 6 * 1000);

  const res = await Otp.create({
    email,
    otp,
    expiresAt
  });
  console.log("otp created: ", res);
}

export const verifyOtp = async (email, otp) => {
  const record = await Otp.findOne({ email, otp });

  if(!record){
    throw new Error("Invalid OTP")
  }

  if(record.expiresAt < new Date()){
    throw new Error("OTP expired");
  }

  await Otp.deleteMany({ email });

  return true
}