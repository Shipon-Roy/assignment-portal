import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return new Response(
      JSON.stringify({ message: "User registered", user: newUser }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Register API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}
