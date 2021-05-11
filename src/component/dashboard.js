import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { _getGenres, _getToken, _getPlaylistByGenre } from "../api/index";
import "./style.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { setLists } from "../redux/actions/listActions";
import _ from "lodash";
const DashBoard = () => {
  const lists = useSelector((state) => state.allLists.lists);

  const [token, settoken] = useState(null);
  const [genres, setgenres] = useState(null);
  const [selectedGenre, setselectedGenre] = useState(null);
  const [musicList, setmusicList] = useState(null);
  // musics = musicList.items
  const [musics, setmusics] = useState(null);
  const [limit, setlimit] = useState(20);
  // myPlaylist
  const [myPlaylist, setmyPlaylist] = useState(null);

  const dispatch = useDispatch();
  console.log(lists, "list outside");

  useEffect(() => {
    _getToken()
      .then((token) => {
        settoken(token);
        _getGenres(token)
          .then((data) => {
            setgenres(data);
            setselectedGenre(data.items[0].id);
            console.log(data, "Genre");
            _getPlaylistByGenre(data.items[0].id, token, limit).then(
              (music) => {
                console.log(music, "music");
                setmusicList(music);
                // setmusics(music.items);
              }
            );
          })
          .catch((err) => {
            console.log(err, "Error while getting Genre");
          });
      })
      .catch((err) => {
        console.log(err, "Error while getting token");
      });
    console.log(lists, "list outside");
    setmyPlaylist(lists);
  }, []);

  const selectGenre = (id) => {
    _getPlaylistByGenre(id, token, limit).then((music) => {
      setselectedGenre(id);
      setmusicList(music);
      setmusics(music.items);
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

    const sInd = source.droppableId;
    const dInd = destination.droppableId;

    if (
      result.source.droppableId == "drop" &&
      result.destination.droppableId == "droppable"
    ) {
      let sourceArr = Array.from(musicList.items);
      let destArr;
      if (myPlaylist) destArr = Array.from(myPlaylist);
      else {
        destArr = [];
      }
      console.log(result.destination);
      const [reorderedItem] = sourceArr.splice(result.source.index, 1);
      console.log(reorderedItem, "reorder");

      destArr.push(reorderedItem);
      console.log(destArr, "before uni");
      let temp = _.uniq(destArr);
      console.log(temp, "temp");
      setmyPlaylist(temp);
      dispatch(setLists(temp));
    }
  }

  const getListStyle = (isDraggingOver) => ({
    background: "lightgrey",
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
              genres.items.length &&
              genres.items.map((node, i) => {
                return (
                  <div
                    key={i}
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

            <Droppable droppableId={`drop`} key="1">
              {(provided, snapshot) => (
                <div
                  className="characters"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  <div className="all-music">
                    {musicList &&
                      musicList.items.map((node, i) => {
                        return (
                          <>
                            <Draggable
                              key={node.id}
                              draggableId={node.id}
                              index={i}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className="each-music">
                                    <img src={node.images[0].url} />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                            {console.log(
                              musicList.items.length,
                              musicList.total
                            )}
                            {musicList.items.length - 1 == i &&
                              musicList.total - 1 > limit && (
                                <p key={limit} onClick={loadMore}>
                                  Load More
                                </p>
                              )}
                          </>
                        );
                      })}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div style={{ width: "33%" }}>
            <div className="heading">
              <h4>My playlist</h4>
            </div>
            <div>
              <Droppable droppableId="droppable" key="1">
                {(provided) => (
                  <div
                    className="characters"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <div
                      className="all-music"
                      style={{
                        width: "100%",
                        minHeight: "50vh",
                        backgroundColor: "lightgray",
                        margin: "5%",
                      }}
                    >
                      {myPlaylist && myPlaylist.length > 0 ? (
                        myPlaylist.map((node, i) => {
                          return (
                            <Draggable
                              key={node.id}
                              draggableId={node.id}
                              index={i}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className="each-music">
                                    <img src={node.images[0].url} />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })
                      ) : (
                        <p>Empty List... </p>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
      </div>
    </>
  );
};

export default DashBoard;
