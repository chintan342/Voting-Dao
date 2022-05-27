import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "./index.scss";
import { useContext } from "react";
import { WalletContext } from "../../Context/WalletContext";
import cogoToast from "cogo-toast";

const validationSchema = Yup.object({
  title: Yup.string().required(),
  options: Yup.string().required(),
  start_date: Yup.date().required(),
  end_date: Yup.date().required()
});

const CreateProposals = () => {
  const { votingContract, accountId } = useContext(WalletContext);

  const navigate = useNavigate();

  const createProposal= async (values) => {
    try{
      if (votingContract) {
        let title, options, startDate, endDate;
        title = values.title;
        options = values.options.split(',');
        startDate = moment(values.start_date).utc().unix();
        endDate = moment(values.end_date).utc().unix();
        // console.log("values = ", values, startDate);

        const create = await votingContract.methods.create(title, options, startDate, endDate).send({
          from: accountId
        });

        console.log("proposal created = ", create);
        cogoToast.success("Proposal created successfully");
        navigate("/");

      }
    } catch(err) {
      let error = JSON.parse(JSON.stringify(err));
      if (error.message) {
        cogoToast.error(error.message);
      } else if (error.error.message) {
        cogoToast.error(error.error.message);
      }
    }
  };

  return (
    <>{ accountId ?
        <Container className="proposals__create">
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
          <h4 className="create__proposal">Create Proposal</h4>
          <Formik
            initialValues={{
              title: "",
              options: "",
              start_date: null,
              end_date: null

            }}
            validationSchema={validationSchema}
            enableReinitialize={false}
            onSubmit={async (values, { setSubmitting }) => {
              // await _createDao(values, setSubmitting);
              await createProposal(values);
              setSubmitting(false);
            }}
          >
            {({ values, handleChange, errors, touched, isSubmitting, setFieldValue }) => {
              return (
                <Form className="">
                  <Row>
                    <Col>
                      <div className="add__proposal__box">
                        <label>Proposal</label>
                        <input
                          placeholder="Proposals Title"
                          name="title"
                          value={values.title}
                          onChange={handleChange}
                        />
                        {errors.title && touched.title ? (
                          <span className="text-danger">{errors.title}</span>
                        ) : null}

                        <div className="from-group">
                          <label>Options</label>
                          <input
                            placeholder="Enter comma seperated options"
                            name="options"
                            value={values.options}
                            onChange={handleChange}
                          />
                          {errors.options && touched.options ? (
                            <span className="text-danger">{errors.options}</span>
                          ) : null}
                        </div>
                        
                        <div className="form-group">
                            <label>Start Date</label>
                            <DatePicker
                              selected={
                                values.start_date
                                  ? moment
                                      .tz(values.start_date, "UTC")
                                      .toDate()
                                  : null
                              }
                              name="start_date"
                              className="form-control"
                              onChange={(date) =>
                                setFieldValue("start_date", date)
                              }
                              timeInputLabel="Time:"
                              dateFormat="dd/MM/yyyy h:mm aa"
                              showTimeInput
                              autoComplete="off"
                            />
                            {errors.start_date && touched.start_date ? (
                              <span className="text-danger">
                                {errors.start_date}
                              </span>
                            ) : null}
                        </div>

                        <div className="form-group">
                          <label>End Date</label>
                          <DatePicker
                            selected={
                              values.end_date
                                ? moment.tz(values.end_date, "UTC").toDate()
                                : null
                            }
                            name="end_date"
                            className="form-control"
                            onChange={(date) =>
                              setFieldValue("end_date", date)
                            }
                            timeInputLabel="Time:"
                            dateFormat="dd/MM/yyyy h:mm aa"
                            showTimeInput
                            autoComplete="off"
                          />
                          {errors.end_date && touched.end_date ? (
                            <span className="text-danger">
                              {errors.end_date}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  { <button
                    type="submit"
                    disabled={isSubmitting}
                    className="add__dao"
                  >
                    {isSubmitting ? "Please wait..." : "Submit Proposal"}
                  </button> }
                </Form>
              );
            }}
          </Formik>
        </Container>
        : 
        <div className="connect-wallet-msg">Please connect to your wallet</div>
      }
    </>
  );
};

export default CreateProposals;
