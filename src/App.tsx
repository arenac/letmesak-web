import { BrowserRouter, Route, Switch} from 'react-router-dom'

import { Home } from 'pages/Home';
import { NewRoom } from 'pages/NewRoom';
import { AuthContextProvider } from 'context/AuthContextProvider';
import { Room } from 'pages/Room';

export type User = {
  id: string,
  name: string,
  avatar: string
}

export type AuthContextType = {
  user: User | undefined
  signInWithGoogle: () => Promise<void>
}

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
