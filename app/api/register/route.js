import { NextResponse } from "next/server";
import { ConnectDB } from "../../../utils/connect";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";

export async function POST(req) {
  try {
    await ConnectDB();
    const { email, password } = await req.json();
    // console.log(email, password);

    const exist = await User.findOne({ email: email });
    if (exist) {
      console.log("User already exist");
      return NextResponse.json(
        { message: "User already exists" },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email,
      password: hashedPassword,
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "An error occurred while processing your request",
      },
      500
    );
  }
}
