import { useParams } from 'react-router-dom'
import logoImg from 'assets/images/logo.svg'
import { Button } from 'components/Button'
import { RoomCode } from 'components/RoomCode'

import 'styles/rooms.scss'
import { FormEvent, useState } from 'react'
import { useAuth } from 'hooks/useAuth'
import { database } from 'services/firebase'
import { spawn } from 'child_process'

type RoomParams = {
  id: string;
}

export function Room() {
  const [newQuestion, setNewQuestion] = useState('')

  const params = useParams<RoomParams>()
  const { user } = useAuth();
  const roomId = params.id;

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
          <h1>React room</h1>
          <span>4 questions</span>
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
      </main>
    </div>  
  )
}