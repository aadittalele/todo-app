import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { uid, createdAt, email, name } = await request.json();

    if (!uid || !email || !name || !createdAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, {
      createdAt,
      email,
      name,
    });
    return NextResponse.json({ message: "User created successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}