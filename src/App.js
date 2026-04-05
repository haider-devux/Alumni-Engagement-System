import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/shared/Home';
import LoginAlumni from './pages/alumni/LoginAlumni';
import SignupAlumni from './pages/alumni/SignupAlumni';
import Dashboard from './pages/alumni/AlumniPanel';
import Events from './pages/alumni/Events';
import EventDetails from './pages/alumni/EventDetails';
import Posts_Tweets from './pages/alumni/Posts_Tweets';
import Help from './pages/alumni/Help';
import Profile from './pages/alumni/Profile';
import Jobs from './pages/alumni/Jobs';
import Directory from './pages/alumni/Directory';
import Postjob from './pages/alumni/Postjob';
import PostEvents from './pages/alumni/PostEvents';
import SubAdminPanel from './pages/subAdmin/SubAdminPanel';
import ManageEvents from './pages/subAdmin/ManageEvents';
import HandleRequests from './pages/subAdmin/HandleRequests';
import MainAdminPanel from './pages/mainAdmin/MainAdminPanel';
import UserRequestForm from './components/UserRequestForm';
import { ChatProvider } from './contexts/ChatContext';
import Chat from './components/Chat/Chat';

function App() {
  return (
    <ChatProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignupAlumni />} />
          <Route path="/login" element={<LoginAlumni />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/posts_tweets" element={<Posts_Tweets />} />
          <Route path="/help" element={<Help />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/postjob" element={<Postjob />} />
          <Route path="/post-events" element={<PostEvents />} />
          <Route path="/sub" element={<SubAdminPanel />} />
          <Route path="/manage-events" element={<ManageEvents />} />
          <Route path="/user-requests" element={<HandleRequests />} />
          <Route path="/main-admin" element={<MainAdminPanel />} />
          <Route path="/request-help" element={<UserRequestForm />} />
          {/* Add other routes here */}
        </Routes>
        {/* Chat component will be available on all alumni pages */}
        <Chat />
      </Router>
    </ChatProvider>
  );
}

export default App;

