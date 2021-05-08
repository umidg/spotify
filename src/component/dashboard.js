import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { _getGenres, _getToken, _getPlaylistByGenre } from "../api/index";
import "./style.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const DashBoard = () => {
  const lists = useSelector((state) => state.allLists.list);
  const [token, settoken] = useState(null);
  const [genres, setgenres] = useState(null);
  const [selectedGenre, setselectedGenre] = useState(null);
  const [musicList, setmusicList] = useState(null);
  const [limit, setlimit] = useState(20);

  useEffect(() => {
    _getToken()
      .then((token) => {
        settoken(token);
        _getGenres(token)
          .then((data) => {
            setgenres(data);
            setselectedGenre(data[0].id);
            console.log(data, "Genre");
            _getPlaylistByGenre(data[0].id, token, limit).then((music) => {
              setmusicList(music);
              console.log(music, "music");
            });
          })
          .catch((err) => {
            console.log(err, "Error while getting Genre");
          });
      })
      .catch((err) => {
        console.log(err, "Error while getting token");
      });
  }, []);

  const selectGenre = (id) => {
    _getPlaylistByGenre(id, token, limit).then((music) => {
      setselectedGenre(id);
      setmusicList(music);
      setlimit(20);
      console.log(music, "music after select");
    });
  };

  const loadMore = () => {
    let remaining = musicList.total - musicList.items.length;
    if (remaining) {
      let newLimit;
      if (remaining > 20) newLimit = limit + 20;
      else {
        newLimit = limit + remaining - 1;
      }
      _getPlaylistByGenre(selectedGenre, token, newLimit).then((music) => {
        console.log(music, "music after select");
        setlimit(newLimit);
        setmusicList(music);
      });
    }
  };

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    console.log(result, "result");
  }

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    // padding: grid * 2,
    // margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    // background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    // padding: grid,
    // width: 250,
  });

  return (
    <>
      {console.log("render")}
      <div style={{ display: "flex", width: "100%" }}>
        <div
          style={{
            display: "block",
            width: "33%",
            // overflowY: "scroll",
          }}
        >
          <div className="heading">
            <h4>Select any genre</h4>
          </div>
          <div className="genre-list">
            {genres &&
              genres.length &&
              genres.map((node) => {
                return (
                  <div
                    className="genre-image"
                    onClick={() => selectGenre(node.id)}
                  >
                    <img src={node.icons[0].url} />
                    <span className="tooltip">{node.name}</span>
                  </div>
                );
              })}
          </div>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ width: "33%" }}>
            <div className="heading">
              <h4>Select any Song</h4>
            </div>
            <Droppable key="1" droppableId={`drop`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  <div className="all-music">
                    {musicList &&
                      musicList.items.map((node, i) => (
                        <Draggable
                          key={node.id}
                          draggableId={node.id}
                          index={i}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <div className="each-music">
                                {/* {console.log(provided, snapshot)} */}
                                <img src={node.images[0].url} />
                              </div>
                              {/* {musicList.items.length < musicList.total - 1 &&
                          musicList.items.length == i + 1 && (
                            <p
                              style={{
                                backgroundColor: "blue",
                                color: "white",
                                height: "100%",
                              }}
                              onClick={loadMore}
                            >
                              Load More
                            </p>
                          )} */}
                            </div>
                          )}
                        </Draggable>
                      ))}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
          <div style={{ width: "33%" }}>
            <div className="heading">
              <h4>My playlist</h4>
            </div>
            <div className="my-playlist">
              <Droppable key="2" droppableId={`droppable`}>
                {(provided, snapshot) => <div>Hello</div>}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
      </div>
    </>
  );
};

export default DashBoard;
