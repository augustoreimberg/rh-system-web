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
import {
    getEmployeesPayroll,
    Employee as FullEmployee,
} from "@/actions/get-employees-payroll";

// Usa o tipo Employee completo para garantir compatibilidade
type Employee = FullEmployee;

interface Payroll {
    id: number;
    documentId: string;
    quantityVR: number;
    quantityVT: number;
    quantityVC: number;
    quantityDayWork: number;
    gratification: number;
    discount: number;
    paidAt: string | null;
    paymentDate: string;
}

interface EditPayrollFormProps {
    employee: Employee;
    payroll: Payroll;
    onSuccess: (updatedEmployee?: Employee) => void;
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
    discount: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
    paymentDate: z.date().nullable(),
    paidAt: z.date().nullable(),
});

export function EditPayrollForm({
    employee,
    payroll,
    onSuccess,
    month,
    year,
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
            discount: payroll.discount,
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
            const paidAt = values.paidAt
                ? format(values.paidAt, "yyyy-MM-dd")
                : null;

            await updatePayroll(payroll.documentId, {
                quantityVR: values.quantityVR,
                quantityVT: values.quantityVT,
                quantityVC: values.quantityVC,
                quantityDayWork: values.quantityDayWork,
                gratification: values.gratification,
                discount: values.discount,
                paidAt,
                paymentDate,
            });

            // Buscar o funcionário atualizado
            const allEmployees = await getEmployeesPayroll(month, year);
            const updatedEmployee = allEmployees.find(
                (e) => e.id === employee.id
            );
            onSuccess(updatedEmployee);
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
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-2"
            >
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
                                    <Input
                                        type="number"
                                        placeholder="R$ 0,00"
                                        {...field}
                                    />
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
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        {...field}
                                    />
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
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        {...field}
                                    />
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
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Desconto</FormLabel>
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
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", {
                                                        locale: ptBR,
                                                    })
                                                ) : (
                                                    <span>
                                                        Selecione uma data
                                                    </span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value || undefined}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date("1900-01-01")
                                            }
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
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", {
                                                        locale: ptBR,
                                                    })
                                                ) : (
                                                    <span>
                                                        Selecione uma data
                                                    </span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value || undefined}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date("1900-01-01")
                                            }
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
                    <p className="text-sm font-medium text-destructive">
                        {error}
                    </p>
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
