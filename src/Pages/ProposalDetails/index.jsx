import { Fragment, useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "./index.scss";
import { WalletContext } from "../../Context/WalletContext";
import moment from "moment-timezone";
import cogoToast from "cogo-toast";

const votingPollAbi = require("../../votingPoll.json");
const currentTime = moment().utc().unix();

const ProposalDetails = () => {
  const [voteLoading, setVoteLoading] = useState(false);
  const {
    accountId,
    votingContract,
    web3Provider,
  } = useContext(WalletContext);
  const [votingPollContract, setVotingPollContract] = useState(null);
  const [proposalData, setProposalData] = useState(null);

  // const navigate = useNavigate();

  const params = useParams();
  useEffect(() => {
    const getOptions = async () => {
      const proposalAddress = await votingContract.methods
        .cloneById(params.proposalId)
        .call();
      const votingPollContract = await new web3Provider.eth.Contract(
        votingPollAbi,
        proposalAddress
      );

      setVotingPollContract(votingPollContract);

      const title = await votingPollContract.methods.title().call();
      const startDate = await votingPollContract.methods.start().call();
      const endDate = await votingPollContract.methods.end().call();
      const status =
        currentTime < startDate
          ? "Created"
          : currentTime > endDate
          ? "Completed"
          : "Active";
      const totalOptions = await votingPollContract.methods
        .getTotalOptions()
        .call();
      const voted = await votingPollContract.methods.voted(accountId).call();
      console.log("useEffect voted = ", voted);
      const totalVotes = await votingPollContract.methods.totalVotes().call();

      let optionsList = [];
      let optionsVotes = [];
      for (let i = 0; i < totalOptions; i++) {
        const option = await votingPollContract.methods.options(i).call();
        let votes = await votingPollContract.methods.optionVotes(i).call();
        optionsList.push(option);
        optionsVotes.push(votes);
      }

      setProposalData({
        title,
        startDate,
        endDate,
        status,
        voted,
        totalVotes,
        options: optionsList,
        votes: optionsVotes,
      });
    };

    if (votingContract) {
      getOptions();
    }
  }, [params.proposalId, votingContract]);

  const voteNow = async (optionId) => {
    try {
      setVoteLoading(true);
      if (votingPollContract) {
        const vote = await votingPollContract.methods.vote(optionId).send({
          from: accountId,
        });

        if (vote) {
          const totalVotes = await votingPollContract.methods
            .totalVotes()
            .call();

          let optionsVotes = [];
          for (let i = 0; i < proposalData.options.length; i++) {
            let votes = await votingPollContract.methods.optionVotes(i).call();
            optionsVotes.push(votes);
          }

          setProposalData((prevState) => ({
            ...prevState,
            totalVotes,
            voted: true,
            votes: optionsVotes,
          }));
        }
      }
    } catch (err) {
      let error = JSON.parse(JSON.stringify(err));
      if (error.message) {
        cogoToast.error(error.message);
      } else if (error.error.message) {
        cogoToast.error(error.error.message);
      }
    } finally {
      setVoteLoading(false);
    }
  };

  return (
    <Fragment>
      <Container className="proposals_details">
        <Link className="go__back__link" to="/">
          <svg
            width="31"
            height="23"
            viewBox="0 0 31 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.664938 9.92048L9.94411 0.641308C10.7992 -0.213769 12.2243 -0.213769 13.0794 0.641308C13.9345 1.49639 13.9345 2.92151 13.0794 3.77659L7.60057 9.28709H27.8691C29.1042 9.28709 30.0859 10.2688 30.0859 11.504C30.0859 12.7391 29.1042 13.7208 27.8691 13.7208H7.60057L13.0794 19.1997C13.9345 20.0547 13.9345 21.4799 13.0794 22.3349C12.636 22.7783 12.066 23 11.4959 23C10.9259 23 10.3558 22.7783 9.91244 22.3349L0.664938 13.0874C0.253233 12.6757 -0.00012207 12.1057 -0.00012207 11.504C-0.00012207 10.9022 0.221565 10.3322 0.664938 9.92048Z"
              fill="#1A1A1A"
            />
          </svg>

          <span>All Proposals</span>
        </Link>
        {proposalData === null ? (
          <h3 className="text-center mt-5 mb-5">Please Wait...</h3>
        ) : (
          <>
            {
              <Fragment>
                <div className="proposals__title">
                  <h1>{proposalData.title}</h1>
                  <span
                    className={`status ${proposalData.status.toLowerCase()}`}
                  >
                    {proposalData.status}
                  </span>
                </div>
                <p className="proposals__desc">
                  Voting ends on{" "}
                  {moment.unix(proposalData.endDate).format("lll")} UTC +0
                </p>
                {!(
                  parseInt(currentTime) >= parseInt(proposalData.startDate) &&
                  parseInt(currentTime) <= parseInt(proposalData.endDate)
                ) ? null : (
                  <>
                    {["Active"].includes(proposalData.status) ? (
                      <Row className="mt-4">
                        {proposalData.options.map((option, index) => (
                          <Col
                            key={`option${index}`}
                            md={4}
                            className="text-center"
                          >
                            {!proposalData.voted && (
                              <button
                                disabled={voteLoading}
                                onClick={() => voteNow(index)}
                                className="btn mx-3"
                                style={{
                                  backgroundColor: "#FFB703",
                                  color: "#000",
                                }}
                              >
                                {!voteLoading ? "Vote For" : "Please wait"}
                              </button>
                            )}
                            <div className="processbar_circle">
                              <CircularProgressbar
                                value={
                                  (proposalData.votes[index] /
                                    proposalData.totalVotes) *
                                    100 || 0
                                }
                                strokeWidth={8}
                                styles={buildStyles({
                                  pathColor: "#FFB703",
                                  trailColor: "#F4F4F4",
                                })}
                              />
                              <span>
                                {option}
                                <br />
                                {proposalData.votes[index]}
                              </span>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    ) : null}
                  </>
                )}
              </Fragment>
            }
          </>
        )}
      </Container>
    </Fragment>
  );
};

export default ProposalDetails;
