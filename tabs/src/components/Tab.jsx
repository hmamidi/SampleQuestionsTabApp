import React from "react";
//import { Welcome } from "./sample/Welcome";
import "./styles.css";

class Tab extends React.Component {

  constructor(props) {
    super(props);
    let date = new Date();
    this.state = {
      show : false,
      newQues : null,
      newAns : null,
      qna : [ {questionId : "1",
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
    }
  }

  onSubmit = () => {
    let qna = this.state.qna;
          let question = {questionId : qna.length + 1,
                          questDesc : this.state.newQues,
                          user : "user1",
                          upvotedby: [],
                          timestamp : new Date(),
                          show : false,
                          answers : [], 
                          }
          qna.push(question);
          this.setState({qna : qna});
          this.setState({newQues : ""});
  }

  render() {
  return (
    <>
    <div className="app">
      <div className="accordian">

      {this.state.qna.map((value, index) => {
        console.log(JSON.stringify(this.state.qna[index]));
         return (<div><div className="accordian-header" onClick={() => {
           console.log("clicked : " + index);
           let qna = this.state.qna;
           if(qna[index].show) {
            qna[index].show = false;
           } else {
            qna[index].show = true;
           }
           this.setState({qna : qna});
         }}>
         <div>{value.questDesc}</div>
         <div className="sign">{this.state.show ? '-' : '+'}</div>
       </div>
       {value.show && (
        <> {value.answers.map((ans, index) => {
          return (<div className="accordian-body">
          {ans.answer}
        </div> );
        })}
        {!value.isNewAns &&<button className="add-answer" onClick={()=> {
           let qna = this.state.qna;
           if(!qna[index].isNewAns) {
            qna[index].isNewAns = true;
           }          
           this.setState({qna : qna});
        }}>+ Add answer</button> }
        {value.isNewAns && (
          <>
                 <input className="answer" type="text" value={this.state.newAns}
                 onChange={e => {
                   this.setState({newAns : e.target.value});
                 }}
                     placeholder=" Pls enter your answer here" name="Answer"/>
                     <button className="ansbutton" onClick={() => {
                        let qna = this.state.qna;
                        let answer = { user : "user1",
                                      timestamp : new Date() ,
                                      answer : this.state.newAns,
                                     };
                        qna[index].answers.push(answer);
                        this.setState({qna : qna});
                        this.setState({newAns : ""});
                     }}>
          Submit</button>
          <button className="ansbutton" onClick={() => {
              let qna = this.state.qna;
              qna[index].isNewAns = false;
              this.setState({qna : qna});
          }}>
          Cancel</button>
          </>
        )}
      </> )}
      </div>
        );
      })}
   </div>
   </div>
   <div className="chat-window">
   <input className="textbox" type="text" value={this.state.newQues}
    onChange={e => {
      this.setState({newQues : e.target.value});
    }}
        placeholder=" Pls enter your question here" name="Name"/>
        <button className="button" onClick={this.onSubmit}>
          Submit</button>
   </div>
   </>
  
  );
  }
}

export default Tab;