"use client";
import { authClient } from '@/lib/auth-client' //import the auth client


import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import {  KeyRound } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
});

type SignupData = z.infer<typeof signupSchema>;

export default function SignupPage() {

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (formData: SignupData) => {
    try {
      setLoading(true);
      setError(null);

      const {data, error} = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message ?? "Ocurrió un error inesperado.");
      } else {
        window.location.href = "/"; // Redirige después del signup
        console.log(data); 
      }
    } catch (e) {
      setError("Ocurrió un error inesperado.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg border">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Crear cuenta
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Nombre completo
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">Correo</label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">Contraseña</label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Botón */}
          <Button variant="outline" disabled={loading} aria-label="Submit">
            <KeyRound /> {loading ? "Creando cuenta..." : "Registrarse"}
          </Button>

        </form>

        <p className="text-center text-sm mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/signin" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
