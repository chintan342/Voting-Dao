import Routes from "./Routes";
import WalletContextProvider from "./Context/WalletContext";

function App() {
  return (
    <WalletContextProvider>
      <Routes />
    </WalletContextProvider>
  );
}

export default App;
