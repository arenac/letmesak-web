import { useHistory } from 'react-router-dom'

import illustrationImg from "assets/images/illustration.svg"
import logImg from "assets/images/logo.svg"
import googleIconImg from "assets/images/google-icon.svg"

import "styles/auth.scss";
import { Button } from "components/Button";
import { useAuth } from 'hooks/useAuth';

export function Home() {
  const history = useHistory()

 const { user, signInWithGoogle } = useAuth()

  async function handleCreateRoom() {
    if(!user) {
      await signInWithGoogle()
    }
    history.push("/rooms/new")
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Illustration for question and answers" />
        <strong>Create Q&amp;A live chat rooms</strong>
        <p>Answer question in real time</p>
      </aside>
      <main>
        <div className="main-container">
          <img src={logImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Google logo" />
            Create a chat room with Google
          </button>

          <div className="separator">or enter in an existing chat room</div>

          <form>
            <input 
              type="text" 
              placeholder="Enter the room code"
            />
            <Button type="submit">
              Enter
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}