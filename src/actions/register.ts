"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationTokenByEmail } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "Invalid fields"};
    }

    const { email, password, name } = validatedFields.data;
    const hashedpassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return { error: "User already exists" };
    } 

    await db.user.create({
        data: {
            email,
            password: hashedpassword,
            name,
        },
    });

    const verificationToken = await generateVerificationTokenByEmail(email);

    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token);

    return {success: "Verification email sent!"};

}