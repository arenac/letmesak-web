import { useParams } from 'react-router-dom'
import logoImg from 'assets/images/logo.svg'
import { Button } from 'components/Button'
import { RoomCode } from 'components/RoomCode'

import 'styles/rooms.scss'
import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from 'hooks/useAuth'
import { database } from 'services/firebase'
import { Question } from 'components/Question'

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}>;

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

type RoomParams = {
  id: string;
}

export function Room() {
  const [newQuestion, setNewQuestion] = useState('')
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');

  const params = useParams<RoomParams>()
  const { user } = useAuth();
  const roomId = params.id;

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    
    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
        }
      });
      
      setQuestions(parsedQuestions);
      setTitle(databaseRoom.title);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if(newQuestion.trim() === '') {
      return
    }

    if(!user) {
      throw new Error('You must be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHightLighted: false,
      isAnswered: false,
    }

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={params.id}/>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Room - {title}</h1>
          { questions.length > 0 && <span>{questions.length} question(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder="Your question"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="from-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>To ask question, <button>login here</button>.</span>
            ) }
            <Button type="submit" disabled={!user}>Send question</Button>
          </div>
        </form>
        
        <div className="question-list">
          {questions.map(question => (
            <Question 
              key={question.id}
              content={question.content}
              author={question.author} 
            />
          ))}
        </div>
      </main>
    </div>  
  )
}