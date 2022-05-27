import { Fragment, useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { WalletContext } from "../../Context/WalletContext";
import cogoToast from "cogo-toast";
import "./index.scss";
import moment from "moment";

const votingPollAbi = require("../../votingPoll.json");

const Dao = () => {
  const { votingContract, web3Provider, accountId } = useContext(WalletContext);
  const [allProposals, setAllProposals] = useState([]);
  const [totalProposals, setTotalProposals] = useState(-1);
  useEffect(() => {
    const getAllProposals = async () => {
      try {
        let storeList = [];
        const totalProposals = await votingContract.methods.id().call();
        setTotalProposals(totalProposals);
        console.log("totalProposals = ", totalProposals);
        const currentTime = moment().utc().unix();

        for (let i = 0; i < totalProposals; i++) {
          let pollData, status;
          const proposalAddress = await votingContract.methods
            .cloneById(i)
            .call();
          console.log("address = ", proposalAddress);
          const votingPollContract = await new web3Provider.eth.Contract(
            votingPollAbi,
            proposalAddress
          );
          const title = await votingPollContract.methods.title().call();
          const startDate = await votingPollContract.methods.start().call();
          const endDate = await votingPollContract.methods.end().call();
          status =
            currentTime < startDate
              ? "Created"
              : currentTime > endDate
              ? "Completed"
              : "Active";
          pollData = {
            id: i,
            title,
            startDate,
            endDate,
            status,
          };
          storeList.push(pollData);
          console.log("poll data = ", pollData);
        }

        setAllProposals(storeList);
      } catch (err) {
        let error = JSON.parse(JSON.stringify(err));
        if (error.message) {
          cogoToast.error(error.message);
        } else if (error.error.message) {
          cogoToast.error(error.error.message);
        }
      }
    };

    if (votingContract) {
      getAllProposals();
    }
  }, [votingContract]);

  return (
    <>
      {
        accountId ?
        <Fragment>
          <Container className="dao__padding">
            <div className="dao__header">
              <h1>DAO Voting</h1>
            </div>
            <div className="proposals__head">
              <h3>Proposals</h3>
              <Link to="/create-proposals">Create Proposals</Link>
            </div>
            <ul className="proposals__list">
              {allProposals.length
                ? allProposals.map((proposalItem, index) => (
                    <Fragment key={index}>
                      <li>
                        <Link to={`/proposals/${proposalItem.id}`}>
                          <span className="title">{proposalItem.title}</span>
                          <span
                            className={`status ${proposalItem.status.toLowerCase()}`}
                          >
                            {proposalItem.status}
                          </span>
                        </Link>
                      </li>
                    </Fragment>
                  ))
                : <div style={{textAlign: 'center', fontSize: '25px'}}>
                  { 
                    totalProposals === -1 ?
                    "Please Wait..."
                    : "No Data to show"
                  }
                  </div>
              }
            </ul>
          </Container>
        </Fragment>
        :
        <div className="connect-wallet-msg">Please connect to your wallet</div>
      }
    </>
  );
};

export default Dao;
