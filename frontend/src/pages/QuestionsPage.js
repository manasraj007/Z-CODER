import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuestionsPage.css';

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [bookmarked, setBookmarked] = useState(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'bookmarked'
  const [selectedPlatform, setSelectedPlatform] = useState('all'); // 'all' or specific platform

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const platforms = [
          { name: 'Codeforces', url: 'https://codeforces.com/api/problemset.problems' },
          { name: 'CodeChef', url: 'https://kontests.net/api/v1/code_chef' },
          { name: 'AtCoder', url: 'https://kenkoooo.com/atcoder/resources/problems.json' },
        ];

        const fetchPlatformQuestions = async (platform) => {
          try {
            const response = await axios.get(platform.url);
            switch (platform.name) {
              case 'Codeforces':
                return response.data.result.problems.map(problem => ({
                  id: `${platform.name}-${problem.contestId}-${problem.index}`,
                  title: problem.name,
                  url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
                  platform: platform.name
                }));
              case 'CodeChef':
                return response.data.map(problem => ({
                  id: `${platform.name}-${problem.code}`,
                  title: problem.name,
                  url: `https://www.codechef.com/problems/${problem.code}`,
                  platform: platform.name
                }));
              case 'AtCoder':
                return response.data.map(problem => ({
                  id: `${platform.name}-${problem.id}`,
                  title: problem.title,
                  url: `https://atcoder.jp/contests/${problem.contest_id}/tasks/${problem.id}`,
                  platform: platform.name
                }));
              
              default:
                return [];
            }
          } catch (error) {
            console.error(`Error fetching questions from ${platform.name}:`, error);
            return [];
          }
        };

        const allQuestions = await Promise.all(platforms.map(fetchPlatformQuestions));
        setQuestions(allQuestions.flat());
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleBookmark = (id) => {
    setBookmarked(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(id)) {
        newBookmarks.delete(id);
      } else {
        newBookmarks.add(id);
      }
      return newBookmarks;
    });
  };

  const viewQuestion = (question) => {
    setCurrentQuestion(question);
    setSolutions([{ id: 1, text: 'Sample solution', comments: ['Great solution!'] }]);
  };

  const addComment = (solutionId) => {
    setSolutions(solutions.map(solution => {
      if (solution.id === solutionId) {
        return {
          ...solution,
          comments: [...solution.comments, newComment]
        };
      }
      return solution;
    }));
    setNewComment("");
  };

  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
  };

  const filteredQuestions = questions.filter(question => {
    if (viewMode === 'bookmarked' && !bookmarked.has(question.id)) {
      return false;
    }
    if (selectedPlatform === 'all') {
      return true;
    }
    return question.platform === selectedPlatform;
  });

  return (
    <div className="questions-page">
      <h1>Questions</h1>
      <div className="view-mode-buttons">
        <button onClick={() => setViewMode('all')}>All Questions</button>
        <button onClick={() => setViewMode('bookmarked')}>Bookmarked Questions</button>
        <select onChange={handlePlatformChange} value={selectedPlatform}>
          <option value="all">All Platforms</option>
          <option value="Codeforces">Codeforces</option>
          <option value="CodeChef">CodeChef</option>
          <option value="AtCoder">AtCoder</option>
        </select>
      </div>
      <div className="questions-list">
        {filteredQuestions.map(question => (
          <div key={question.id} className="question-item">
            <a href={question.url} target="_blank" rel="noopener noreferrer">{question.title}</a>
            <button onClick={() => handleBookmark(question.id)}>
              {bookmarked.has(question.id) ? 'Unbookmark' : 'Bookmark'}
            </button>
            <button onClick={() => viewQuestion(question)}>View Solutions</button>
          </div>
        ))}
      </div>
      {currentQuestion && (
        <div className="question-details">
          <h2>{currentQuestion.title}</h2>
          <div className="solutions">
            {solutions.map(solution => (
              <div key={solution.id} className="solution">
                <p>{solution.text}</p>
                <div className="comments">
                  {solution.comments.map((comment, index) => (
                    <p key={index}>{comment}</p>
                  ))}
                </div>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment"
                />
                <button onClick={() => addComment(solution.id)}>Add Comment</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;
