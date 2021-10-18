import React from "react";
//import { Welcome } from "./sample/Welcome";
import "./styles.css";
import {AiOutlineSend} from "react-icons/ai";
import {BsHandThumbsUp} from "react-icons/bs";
import {ImCheckmark,ImCross} from "react-icons/im";
//import { useTeamsFx } from "./sample/lib/useTeamsFx";
import { TeamsUserCredential } from "@microsoft/teamsfx";

class Tab extends React.Component {

   constructor(props) {
    super(props);
    let date = new Date();
    this.state = {
      show : false,
      newQues : null,
      newAns : null,
      user : null,
      qna: [],
      isLoaded : false,
      quesIdMap : new Map(),
      questionsnanswers : [ {questionId : "1",
               questDesc : "question 1 Desc",
               user : "user1",
               upvotedby: ["a", "b", "c"],
               timestamp : date - 1000 * 60 * 60 * 24 * 2,
               show : false,
               isNewAns : false,
               answers : [{ user : "user2",
                            timestamp : date - 1000 * 60 * 60 * 24 ,
                            answer : "q1answer1",
                          }, 
                          {user : "user3",
                           timestamp : date - 1000 * 60 * 60 * 24*0.5 ,
                           answer : "q1answer2",
                          },
                          {user : "user4",
                          timestamp : date - 1000 * 60 * 60 * 24*0.5 ,
                          answer : "q1answer3",
                         }
                        ],
              },
              {questionId : "2",
               questDesc : "question 2 Desc",
               user : "user2",
               upvotedby: ["a", "b", "c"],
               timestamp : date - 1000 * 60 * 60 * 24 * 2,
               show : false,
               isNewAns : false,
               answers : [{ user : "user1",
                            timestamp : date - 1000 * 60 * 60 * 24 ,
                            answer : "q2answer1",
                          }, 
                          {user : "user3",
                           timestamp : date - 1000 * 60 * 60 * 24*0.5 ,
                           answer : "q2answer2",
                          }],
              },
              {questionId : "3",
               questDesc : "question 3 Desc",
               user : "user3",
               upvotedby: ["a", "b", "c"],
               timestamp : date - 1000 * 60 * 60 * 24 * 2,
               show : false,
               isNewAns : false,
               answers : [{ user : "user1",
                            timestamp : date - 1000 * 60 * 60 * 24 ,
                            answer : "q3answer1",
                          }, 
                          {user : "user2",
                           timestamp : date - 1000 * 60 * 60 * 24*0.5 ,
                           answer : "q3answer2",
                          }],
              }
      ]
    };
   
  }

  componentDidMount () {

            fetch('https://teamsquestions.azurewebsites.net/questions/all')
            .then(response => {
              //console.log("Get response : " + response.json());
              response.json().then(data => {
                console.log("json res : " + data);
                let qnaData = JSON.stringify(data);
                console.log("qnaData length : " + qnaData.length);
                this.setState({qna : data});
                this.setState({isLoaded : true});
              })
            })
            .catch(error => console.log(error));  
            
             //const { isInTeams } = useTeamsFx();
              const credential = new TeamsUserCredential();
              credential.getUserInfo().then(result => {
                console.log("User Info : " + JSON.stringify(result));
                this.setState({user : result.preferredUserName});
              });
  }

  componentDidUpdate(prevProps, prevState) {

    fetch('https://teamsquestions.azurewebsites.net/questions/all')
            .then(response => {
              response.json().then(data => {
                let qnaData = JSON.stringify(data);
                console.log("Did Update qnaData length : " + qnaData.length);
                this.setState({qna : data});
                this.setState({isLoaded : true});
              })
            })
            .catch(error => console.log(error)); 
  }

  onSubmit = () => {
        fetch('https://teamsquestions.azurewebsites.net/question', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body : JSON.stringify({ "questDesc" : this.state.newQues,
                    "user" : this.state.user,
                    })
            })
            .then(response => {
              console.log(" post response : " + response); 
            });
  }

  render() {
  if(this.state.isLoaded) {
  return (
    <>
    <div className="app">
      <div className="accordian">
      {this.state.qna.map((value, index) => {
        console.log(JSON.stringify(this.state.qna[index]));
         return (<div>
           <div className="usertimestamp" >
             <div className="left">{value.user}</div>
             <div className="right">{value.timeStamp}</div>
            </div>
            <div className="accord">
           <div className="accordian-header" onClick={() => {
           console.log("clicked : " + index);
           let qId = value.questionId;
           let quesIdMap = this.state.quesIdMap;

           if(quesIdMap.has(qId)) {
              let mapValue = quesIdMap.get(qId);
              console.log("map Value : " + JSON.stringify(mapValue));
              if(mapValue.show) {
                mapValue.show = false;
              } else {
                mapValue.show = true;
              }
              quesIdMap.set(qId, mapValue);
           } else {
            quesIdMap.set(qId, {
              show : false,
              isNewAns : false,
              });
           }
           this.setState({quesIdMap : quesIdMap});
         }}>
         <div>{value.questDesc}</div>  
         <div className="sign">{(this.state.quesIdMap.has(value.questionId) && ((this.state.quesIdMap.get(value.questionId)).show)) ? '-' : '+'}</div> 
       </div>
       <button className="thumpsUpbutton" onClick={() => {
          let upvoteSet = new Set(value.upvotedBy);
          if(!upvoteSet.has(this.state.user)) {
            fetch('https://teamsquestions.azurewebsites.net/question/'
            + value.questionId + '/upvote/' + this.state.user, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json;charset=utf-8'
                },
                })
                .then(response => {
                console.log("upvote post response : " + response); 
                });
          }
       }}>
       <BsHandThumbsUp size="20px" />
       </button>
       <div>{value.upvotedBy.length}</div>
       </div>
       {(this.state.quesIdMap.has(value.questionId) &&
        ((this.state.quesIdMap.get(value.questionId)).show)) && (
        <> {value.answers.map((ans, index) => {
          return (<>
          <div className="usertimestamp" >
          <div className="left">{ans.user}</div>
          <div className="right">{(new Date(ans.timeStamp)).toGMTString()}</div>
          </div>
          <div className="accordian-body">
          {ans.answer}
        </div>
        </> );
        })}
        {!(this.state.quesIdMap.get(value.questionId)).isNewAns &&<button className="add-answer" onClick={()=> {
           
           let quesIdMap = this.state.quesIdMap;
           if(!quesIdMap.get(value.questionId).isNewAns) {
            quesIdMap.get(value.questionId).isNewAns = true;
           }          
           this.setState({quesIdMap : quesIdMap});
        }}>+ Add answer</button> }
        {(this.state.quesIdMap.get(value.questionId)).isNewAns && (
          <>
                 <textarea className="answer" value={this.state.newAns}
                 onChange={e => {
                   this.setState({newAns : e.target.value});
                 }}
                     placeholder=" Pls enter your answer here" name="Answer"/>
                     <button className="ansbutton" onClick={() => {

                        fetch('https://teamsquestions.azurewebsites.net/question/'
                         + value.questionId + '/answer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body : JSON.stringify({ user : this.state.user,
            answer : this.state.newAns,
            })
            })
            .then(response => {
              console.log(" post response : " + response); 
            });
                     }}>
          <ImCheckmark /></button>
          <button className="ansbutton" onClick={() => {
              let quesIdMap = this.state.quesIdMap;
              quesIdMap.get(value.questionId).isNewAns = false;
              this.setState({quesIdMap : quesIdMap});
          }}>
          <ImCross/></button>
          </>
        )}
      </> )}
      </div>
        );
      })}
   </div>
   </div>
   <div className="chat-box">
   <textarea className="textbox" type="text" value={this.state.newQues}
    onChange={e => {
      this.setState({newQues : e.target.value});
    }}
        placeholder=" Pls enter your question here" name="Name"/>
        <button className="button" onClick={this.onSubmit}>
          <AiOutlineSend size="30px" />
          </button>
   </div>
   </>

  );
  } else {
    return (<div> Loading </div>);
  }
 }
}

export default Tab;