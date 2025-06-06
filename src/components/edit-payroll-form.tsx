"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updatePayroll } from "@/actions/payroll-actions";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Employee {
  id: number;
  documentId: string;
  name: string;
  VC: number;
  VT: number;
  VR: number;
  VA: number;
}

interface Payroll {
  id: number;
  documentId: string;
  quantityVR: number;
  quantityVT: number;
  quantityVC: number;
  quantityDayWork: number;
  gratification: number;
  paidAt: string | null;
  paymentDate: string;
}

interface EditPayrollFormProps {
  employee: Employee;
  payroll: Payroll;
  onSuccess: () => void;
  month: number;
  year: number;
}

const formSchema = z.object({
  quantityVR: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
  quantityVT: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
  quantityVC: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
  quantityDayWork: z.coerce
    .number()
    .min(0, "Deve ser maior ou igual a 0")
    .max(31, "Máximo de 31 dias"),
  gratification: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
  paymentDate: z.date().nullable(),
  paidAt: z.date().nullable(),
});

export function EditPayrollForm({
  employee,
  payroll,
  onSuccess,
}: EditPayrollFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentDate = payroll.paymentDate
    ? parseISO(payroll.paymentDate)
    : null;
  const paidAt = payroll.paidAt ? parseISO(payroll.paidAt) : null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantityVR: payroll.quantityVR,
      quantityVT: payroll.quantityVT,
      quantityVC: payroll.quantityVC,
      quantityDayWork: payroll.quantityDayWork,
      gratification: payroll.gratification,
      paymentDate: paymentDate,
      paidAt: paidAt,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);

    try {
      const paymentDate = values.paymentDate
        ? format(values.paymentDate, "yyyy-MM-dd")
        : null;
      const paidAt = values.paidAt ? format(values.paidAt, "yyyy-MM-dd") : null;

      await updatePayroll(payroll.documentId, {
        quantityVR: values.quantityVR,
        quantityVT: values.quantityVT,
        quantityVC: values.quantityVC,
        quantityDayWork: values.quantityDayWork,
        gratification: values.gratification,
        paidAt,
        paymentDate,
      });

      onSuccess();
    } catch (err) {
      console.error("Erro ao atualizar folha de pagamento:", err);
      setError(
        "Ocorreu um erro ao atualizar a folha de pagamento. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
        <div className="mb-4">
          <p className="font-medium">Funcionário: {employee.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantityDayWork"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dias Trabalhados</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gratification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gratificação (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="quantityVR"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qtd. VR</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantityVT"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qtd. VT</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantityVC"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qtd. VC</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="paymentDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Pagamento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paidAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Pago em</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Restaurar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              "Gerar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
