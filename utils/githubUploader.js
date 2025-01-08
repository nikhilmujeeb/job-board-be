import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const uploadToGitHub = async (fileName, content) => {
  const url = `https://api.github.com/repos/your-username/your-repo/contents/${fileName}`;
  const base64Content = Buffer.from(content).toString('base64');

  const response = await axios.put(
    url,
    {
      message: `Upload ${fileName}`,
      content: base64Content,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // Use environment variable for token
      },
    }
  );

  return response.data;
};

export default uploadToGitHub;
