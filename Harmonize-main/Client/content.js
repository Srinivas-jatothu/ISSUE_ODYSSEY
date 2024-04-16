// Sample JSON data to be displayed as issues
const issuesData = [
  {
    "issue_no": 1324,
    "issue_link": "https://github.com/example/repo/issues/1",
    "issue_title": "Fixing the login bug",
    "similarity_per": "95%"
  },
  {
    "issue_no": 9842,
    "issue_link": "https://github.com/example/repo/issues/2",
    "issue_title": "Update dependencies to newer versions",
    "similarity_per": "80%"
  },
  {
    "issue_no": 4353,
    "issue_link": "https://github.com/example/repo/issues/3",
    "issue_title": "Refactor the user authentication system srinivas srinivasa saidlfakjsdf  asd;lkfa asdfaasdfa sdf asd asd asdf asdf ",
    "similarity_per": "89%"
  },
  {
    "issue_no": 1354,
    "issue_link": "https://github.com/example/repo/issues/4",
    "issue_title": "Optimize database queries",
    "similarity_per": "92%"
  },
  {
    "issue_no": 5679,
    "issue_link": "https://github.com/example/repo/issues/5",
    "issue_title": "Improve UI responsiveness",
    "similarity_per": "88%"
  }
];

//import json from harmonize/client/dummy.json code looks like 

function sortIssuesBySimilarity(issues) {
  return issues.sort((a, b) => parseFloat(b.similarity_per) - parseFloat(a.similarity_per));
}

function truncateTitle(title, maxWords = 8) {
  const words = title.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return title;
}

function appendCommitSummaryBox() {
  // Sort the issues before appending them to the DOM
  const sortedIssues = sortIssuesBySimilarity(issuesData);

  const newDiv = document.createElement('div');
  let linksHtml = sortedIssues.slice(0, 3).map(issue =>
      `<div class="issue-entry">
          <a href="${issue.issue_link}">${truncateTitle(issue.issue_title)} <span class="issue-number">#${issue.issue_no}</span></a>
          <span class="similarity">Similarity: ${issue.similarity_per}</span>
      </div>`).join('');

  newDiv.innerHTML = `
    <div class="commit-summary-box">
      <h1>GITHUB ISSUES</h1>
      <hr>
      <div>${linksHtml}</div>
      <button class="show-more-btn">Show More</button>
    </div>
  `;
  newDiv.classList.add("custom-commit-box");

  const container = document.querySelector('body');
  if (container) {
    container.appendChild(newDiv);
  }

  document.querySelector('.show-more-btn').addEventListener('click', function() {
      const extendedHtml = sortedIssues.map(issue =>
          `<div class="issue-entry">
              <a href="${issue.issue_link}">${truncateTitle(issue.issue_title)} <span class="issue-number">#${issue.issue_no}</span></a>
              <span class="similarity">Similarity: ${issue.similarity_per}</span>
          </div>`).join('');
      document.querySelector('.commit-summary-box > div').innerHTML = extendedHtml;
      this.remove(); // Remove the button after expanding
  });
}

// document.addEventListener('DOMContentLoaded', appendCommitSummaryBox);



// document.addEventListener('DOMContentLoaded', appendCommitSummaryBox);

// Style for the box and entries
const style = document.createElement('style');
style.innerHTML = `
.custom-commit-box {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background-color: #333;  // Dark background color
  color: #fff;             // Light text color
  border: 1px solid #555;  // Darker border for better contrast
  box-shadow: 0 2px 6px rgba(0,0,0,0.3); // Stronger shadow for dark theme
  padding: 10px;
  z-index: 1000;
  font-family: Arial, sans-serif;
  max-height: 90%;        // Max height to avoid 100% height
  overflow: auto;         // Allow scrolling if content is too long
}
.custom-commit-box h1 {
  font-size: 16px;
  margin-bottom: 10px;    // Added margin for better spacing
}
.issue-entry {
  margin-bottom: 10px;
}
.issue-entry a {
  text-decoration: none;
  color: #4da6ff;         // A light blue color for links to stand out
}
.issue-entry .similarity {
  display: block;
  color: #bbb;            // A lighter gray for subtext
  font-size: 12px;
}
`;

document.head.appendChild(style);


// Check if the GitHub specific elements are loaded before executing
const observer = new MutationObserver((mutations, obs) => {
    const pageHeader = document.querySelector('body');
    const url = window.location.href;
    const githubIssueRegex = /^https:\/\/github\.com\/[\w\-]+\/[\w\-]+\/issues\/(\d+)(\/)?$/;

    if (githubIssueRegex.test(url)) {
      if (pageHeader) {
        appendCommitSummaryBox();
        obs.disconnect(); // Stop observing after appending
        return;
      }
    }

    // Stop observing if the page is not a GitHub repository page
    if (!githubIssueRegex.test(url)) {
      console.log('Not a GitHub repository page')
      obs.disconnect();
    }
});

observer.observe(document, {
    childList: true,
    subtree: true
});
