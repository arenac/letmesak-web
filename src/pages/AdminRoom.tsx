import { useHistory, useParams } from 'react-router-dom'
import logoImg from 'assets/images/logo.svg'
import deleteImg from 'assets/images/delete.svg'
import { Button } from 'components/Button'
import { RoomCode } from 'components/RoomCode'

import 'styles/admin-room.scss'

import { database } from 'services/firebase'
import { Question } from 'components/Question'
import { useRoom } from 'hooks/useRoom'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>()
  const roomId = params.id;

  const history = useHistory();

  const { questions, title } = useRoom(roomId);

  async function handleDeleteQuestion(questionId: string) {
    if(window.confirm('Do you want to delete this question?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/`).remove();
    }
  }

  async function handleEndRoom() {
    if(window.confirm('Do you want to end this room?')) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date()
      });

      history.push('/');
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={params.id}/>
            <Button isOutlined onClick={handleEndRoom}>End room</Button>
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
            >
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Delete question" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>  
  )
}