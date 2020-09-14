const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoriesId(request, response, next){
  const {id} = request.params;

  if(!isUuid(id)){
      return response.status(400).json({error:"Invalid project Repository."})
  }

  return next();
}


app.use('/repositories/:id', validateRepositoriesId)



app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;    
  const repository = {id:uuid(), title, url, techs, likes:0};
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params
  const {title, url, techs} = request.body;
  let likes=0;  

  const repositoryIdex = repositories.findIndex(repository=>repository.id===id)
  if(repositoryIdex < 0){
      return response.status(400).json({"error":"Repository not Found"});
  }

  likes = repositories[repositoryIdex].likes;

  const repository ={id, title, url, techs, likes};

  repositories[repositoryIdex]=repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params
 
  const repositoryIdex = repositories.findIndex(repository=>repository.id===id)
  if(repositoryIdex < 0){
      return response.status(400).json({"error":"Repository not Found"});
  }

  repositories.splice(repositoryIdex,1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params
 
  const repositoryIndex = repositories.findIndex(repository=>repository.id===id)
  if(repositoryIndex < 0){
      return response.status(400).json({"error":"Repository not Found"});
  }

  const {title, url, techs} = repositories[repositoryIndex];
  let likes = repositories[repositoryIndex].likes+1;

  const repository ={id, title, url, techs, likes};

  repositories[repositoryIndex]=repository;

  return response.json(repository);
});

module.exports = app;
