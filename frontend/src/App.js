// import React

// import layouts
import Header from './layout/Header'
import Body from './layout/Body'
import Footer from './layout/Footer'
// import components
import NewTask from './components/NewTask'
import Tasks from './components/Tasks'
import ShowBy from './components/ShowBy'
import SortBy from './components/SortBy'
// import styles
import './styles/globals.css';

function App() {
  return (
    <div>
        <Header />
        <Body>
          <NewTask />
          <Tasks>
            <ShowBy />
            <SortBy />
          </Tasks>
        </Body>
        <Footer />
    </div>
  );
}

export default App;
