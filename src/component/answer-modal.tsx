import {
    Card,
    CardContent,
    CardDescription,
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
      answers: z
        .string()
        .min(10, {
          message: "Answer must be at least 10 characters.",
        })
        .max(160, {
          message: "Answer must not be longer than 30 characters.",
        }),
      })
  
      const supabase = createClient(import.meta.env.SUPABASE_URL!, import.meta.env.SUPABASE_ANON_KEY!);
  
     
  
      
  interface AnswerModalProps {
      onClose: () => void;
      id: number,
      question: string
  }
  export function AnswerCard({onClose, id, question}: AnswerModalProps) {
  
      const form = useForm<z.infer<typeof FormSchema>>({
          resolver: zodResolver(FormSchema),
        })
      async function onSubmit(data: z.infer<typeof FormSchema>) {
      console.log("this was in answe");
          toast({
          title: "You submitted the following values:",
          description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">{JSON.stringify(data, null, 2)}</code>
              </pre>
          ),
          })

          const {data:response, error} = await supabase
          .from("QnA")
          .update({...data, answered: true})
          .eq("id", id);
          if(response){
            toast({
                title: "Question has been answered",
            })
          }else if(error){
            toast({
                title: "An error occurred",
            })
          }

          onClose();
      }
    
    return (
      <div className="absolute top-1/2 left-1/2 text-white transform -translate-x-1/2 -translate-y-1/2 z-40">
          <Card className="w-[350px] ">
          <CardHeader>
              <CardTitle>Create Answer</CardTitle>
              <CardDescription>{question}</CardDescription>
          </CardHeader>
          <CardContent>
              <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                  <FormField
                  control={form.control}
                  name="answers"
                  render={({ field }) => (
                      <FormItem>
                      <FormControl>
                          <Textarea
                          placeholder="Answer question"
                          className="resize-none"
                          {...field}
                          />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={onClose} >Close</Button>
                    <Button type="submit" >Submit</Button>
                  </div>
              </form>
              </Form>
          </CardContent>
          </Card>
      </div>
    )
  }
  