import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import Dao from "./Pages/Dao";
import ProposalDetails from "./Pages/ProposalDetails";
import CreateProposals from "./Pages/CreateProposals";

const ReactRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Dao />} />
        <Route path="proposals/:proposalId" element={<ProposalDetails />} />
        <Route path="create-proposals" element={<CreateProposals />} />
      </Route>
    </Routes>
  );
};
export default ReactRoutes;
