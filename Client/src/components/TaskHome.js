import React, {useState, useEffect} from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard'

const TaskHome = ({task}) => {
    console.log('task', task)

    const [isCopied, setIsCopied] = useState(false)

    const handleCopyClick = () => {
        copyTextToClipboard(task.url)
          .then(() => {
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 1500);
          })
          .catch((err) => {
            console.log(err);
          });
        }

    return(
        <ol className="list-preview">
        <li>
          <article>
            <div className="entry-header">
              <p>{task.title}</p>
            </div>
            <div className="markdown">
              <p>{task.description}</p>
            </div>
            <div className="link-container">
              <p class="link">{task.url}</p>
              <button class="copy-btn" onClick={handleCopyClick}>
                  <span>{isCopied ? 'Скопирован!' : 'Скопировать'}</span>
              </button>
            </div>
          </article>
        </li>
      </ol>
    );
};
export default TaskHome;