import {useState, useEffect} from "react"
 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import './App.css'
import { QuestionCard } from "./component/question-modal"
import { createClient } from "@supabase/supabase-js";
import { Check } from "lucide-react";
import { AnswerCard } from "./component/answer-modal"

interface IRecord {
    id: number,
    created_at: Date,
    questions: string,
    answer: string,
    answered: boolean
}

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

function App() {
    const [records, setRecords] = useState<IRecord[]>([]);
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
    const [showAnswer, setShowAnswer] = useState(0);
    useEffect(() => {
        getRecords();
      }, [isQuestionSubmitted]);
    


    async function getRecords() {
        const { data} = await supabase.from("QnA").select().returns<IRecord[]>();
        if(data){
            setRecords(data);
        }
    }

    const [data, setData] = useState({
        id: -1,
        questions: ""
    });
    const openQuestionModal = () => {
        setIsQuestionModalOpen(true);
    };



  return (
    <div>
        <div className="flex justify-end">
        <Button onClick={openQuestionModal}>Create Question</Button>
            {isQuestionModalOpen && <QuestionCard onClose={()=> {
                setIsQuestionModalOpen(false)
                setIsQuestionSubmitted(true);
            }}/>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {
                records.map((record) => (
                    <Card className="w-[350px] relative" key={record.id}>
                        {
                            record.answered && <div className="w-14 h-14 bg-lime-800 rounded-full flex justify-center items-center absolute -right-2 -top-5">
                            <Check size={40} strokeWidth={3} color="white" />
                        </div>
                        }
                        <CardHeader>
                            <CardTitle>{record.questions}</CardTitle>
                            <CardDescription>{record.answer}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p></p>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            {
                            !record.answered &&
                             <Button onClick={()=> {
                                setShowAnswer(record.id)
                                setData({id: record.id, questions: record.questions})
                            }}>Answer</Button>
                            }

                        </CardFooter>
                    </Card>
                ))
            }
        </div>
            {
                showAnswer == data.id &&
                <AnswerCard id={data.id} question={data.questions} onClose={() => setShowAnswer(0)}/>
            } 


    </div>
  )
}

export default App
