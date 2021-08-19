import { useParams } from 'react-router-dom'
import logoImg from 'assets/images/logo.svg'
import { Button } from 'components/Button'
import { RoomCode } from 'components/RoomCode'

import 'styles/admin-room.scss'

import { FormEvent, useState } from 'react'
import { useAuth } from 'hooks/useAuth'
import { database } from 'services/firebase'
import { Question } from 'components/Question'
import { useRoom } from 'hooks/useRoom'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const [newQuestion, setNewQuestion] = useState('')
  
  const { user } = useAuth();
  const params = useParams<RoomParams>()
  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

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
          <div>
            <RoomCode code={params.id}/>
            <Button isOutlined>Close room</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Room - {title}</h1>
          { questions.length > 0 && <span>{questions.length} question(s)</span>}
        </div>
        
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