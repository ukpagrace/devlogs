import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js";
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
    questions: z
      .string()
      .min(10, {
        message: "Questions must be at least 10 characters.",
      })
      .max(160, {
        message: "Questions must not be longer than 30 characters.",
      }),
    })

    const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

   

    
interface QuestionModalProps {
    onClose: () => void;
}
export function QuestionCard({onClose}: QuestionModalProps) {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
      })
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
        title: "You submitted the following values:",
        description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
        ),
        })
        console.log({data});
        const result =  await supabase.from("QnA").insert(data);
       console.log(result);

        onClose();
    }
  
  return (
    <div className="absolute top-1/2 left-1/2 text-white transform -translate-x-1/2 -translate-y-1/2 z-40">
        <Card className="w-[350px] ">
        <CardHeader>
            <CardTitle>Create Question</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                control={form.control}
                name="questions"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Textarea
                        placeholder="Type your question"
                        className="resize-none"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" >Submit</Button>
            </form>
            </Form>
        </CardContent>
        </Card>
    </div>
  )
}
