import {
  ListItem,
  List,
  ListItemText,
  ListItemIcon,
  Checkbox,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

function App() {
  const [todoList, setTodoList] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [buttonMode, setButtonMode] = useState("Add");
  const [editingID, setEditingID] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/todoList")
      .then(async (response) => {
        setTodoList(JSON.parse(await response.text()));
      })
      .catch((error) => console.log(error));
  }, []);

  const buttonPressed = (todoTitle, todoDescription) => {
    if (buttonMode === "Add") {
      addTodoItem(todoTitle, todoDescription);
    } else if (buttonMode === "Edit") {
      editTodoItem(editingID, todoTitle, todoDescription);
    }
    setTitle("");
    setDescription("");
    setButtonMode("Add");
  };

  const addTodoItem = (todoTitle, todoDescription) => {
    fetch("http://localhost:5000/todoList", {
      method: "POST",
      body: JSON.stringify({
        type: "create",
        title: todoTitle,
        description: todoDescription,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      setTodoList(JSON.parse(await res.text()));
    });
  };

  const checkTodoItem = (itemID, completed) => {
    fetch("http://localhost:5000/todoList", {
      method: "POST",
      body: JSON.stringify({ type: "check", id: itemID, completed: completed }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      setTodoList(JSON.parse(await res.text()));
    });
  };

  const editTodoItem = (itemID, todoTitle, todoDescription) => {
    fetch("http://localhost:5000/todoList", {
      method: "POST",
      body: JSON.stringify({
        type: "update",
        id: itemID,
        title: todoTitle,
        description: todoDescription,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      setTodoList(JSON.parse(await res.text()));
    });
  };

  const deleteTodoItem = (itemID) => {
    fetch("http://localhost:5000/todoList", {
      method: "DELETE",
      body: JSON.stringify({ id: itemID }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      setTodoList(JSON.parse(await res.text()));
    });
  };

  return (
    <Stack>
      <List>
        {todoList.map((item, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <Checkbox
                checked={item.completed}
                onClick={() => {
                  checkTodoItem(item.id, !item.completed);
                }}
              />
            </ListItemIcon>
            <ListItemText primary={item.title} secondary={item.description} />
            <Button
              onClick={() => {
                if (buttonMode === "Add") {
                  setButtonMode("Edit");
                  setEditingID(item.id);
                  setTitle(item.title);
                  setDescription(item.description);
                }
              }}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                deleteTodoItem(item.id);
              }}
            >
              Remove
            </Button>
          </ListItem>
        ))}
      </List>
      <TextField
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
        inputProps={{
          "aria-label": "Title",
        }}
      />
      <TextField
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
        }}
        inputProps={{
          "aria-label": "Description",
        }}
      />
      <Button
        onClick={() => {
          buttonPressed(title, description);
        }}
      >
        {buttonMode}
      </Button>
    </Stack>
  );
}

export default App;
