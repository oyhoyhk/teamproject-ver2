function init() {
  filterListArray = [`자연`, `인물`, `건축`, `음식`];
  loadToggle(false, 1200);
  mainPageSetting();
  loginButtonSetting();
  const myPageButton = document.getElementById(`myPage`);
  myPageButton.addEventListener(`click`, myPageClickEvent);
  categoryListSetting();
  const noticeButton = document.getElementById(`notice`);
  noticeButton.addEventListener(`click`, noticeClickEvent);
}

function noticeClickEvent() {
  loadToggle(true);
  setTimeout(() => {
    const mF = document.getElementById(`mainFrame`);
    const xhq = new XMLHttpRequest();
    xhq.open(`get`, `notice.html`);
    xhq.send();
    xhq.onload = () => {
      mF.innerHTML = xhq.response;
      const table = document.getElementById(`table`);
      const tbody = document.createElement(`tbody`);
      const noticeXHQ = new XMLHttpRequest();
      noticeXHQ.open(`get`, `js/notice.json`);
      noticeXHQ.send();
      noticeXHQ.onload = () => {
        const data = JSON.parse(noticeXHQ.responseText);
        console.log(data);
        let a = "";
        for (let i = 0; i < data.length; i++) {
          a += `<tr>
                  <td>${i + 1}</td>
                  <td>${data[i].title}</td>
                  <td>${data[i].date}</td>
                  <td>${data[i].writer}</td>
                </tr>`;
        }
        console.log(a);
        tbody.innerHTML = a;
      };

      console.log(tbody.innerHTML);
      table.append(tbody);
    };
  }, 1200);
  loadToggle(false, 1200);
}

function categoryListSetting() {
  let chosenCategory = -1;

  const categoryUl = document.getElementById(`categoryBox`);
  Array.from(categoryUl.children).forEach((elem, i) => {
    elem.addEventListener(`click`, () => {
      if (chosenCategory != i && i < 4) {
        chosenCategory != -1
          ? categoryUl.children[chosenCategory].classList.remove(`categoryOn`)
          : "";
        elem.classList.add(`categoryOn`);
        chosenCategory = i;
      }
      if (i == 4) {
        loadToggle(true);
        setTimeout(() => {
          const mF = document.getElementById(`mainFrame`);
          mF.innerHTML = "";
          const searchXHQ = new XMLHttpRequest();
          searchXHQ.open(`get`, `searchedPage.html`);
          searchXHQ.send();
          searchXHQ.onload = () => {
            mF.innerHTML = searchXHQ.response;
            const dataAjax = new XMLHttpRequest();
            const filterList = document.getElementById(`filterList`);
            chosenCategory == -1
              ? filterList.children[0].classList.add(`filterOn`)
              : filterList.children[chosenCategory + 1].classList.add(
                  `filterOn`
                );

            dataAjax.open(`get`, `js/data.json`);
            dataAjax.send();
            dataAjax.onload = () => {
              const data = JSON.parse(dataAjax.responseText);
              printPhotos(data, chosenCategory);
            };

            Array.from(filterList.children).forEach((elem, i) => {
              elem.addEventListener(`click`, () => {
                console.log(areas);
                console.log(areaToggle);
                toggleCount = 0;
                areaToggle.forEach((elem, i) => {
                  if (elem) {
                    areas[i].children[0].classList.remove("areaOn");
                  }
                  elem = false;
                });
                const dataXhq = new XMLHttpRequest();
                dataXhq.open(`get`, `js/data.json`);
                dataXhq.send();
                dataXhq.onload = () => {
                  const data = JSON.parse(dataXhq.responseText);
                  printPhotos(data, i - 1);
                };
                filterList.children[chosenCategory + 1].classList.remove(
                  `filterOn`
                );
                elem.classList.add(`filterOn`);
                chosenCategory = i - 1;
              });
            });
            const areas = document.querySelectorAll(`.area`);
            let areaToggle = new Array();
            let toggleCount = 0;
            for (let i = 0; i < 7; i++) {
              areaToggle.push(false);
            }

            areas.forEach((elem, i) => {
              elem.addEventListener(`click`, () => {
                if (i < 7) {
                  console.log(photos.children);
                  if (!areaToggle[i]) {
                    elem.children[0].classList.add(`areaOn`);
                    toggleCount++;
                  } else {
                    elem.children[0].classList.remove(`areaOn`);
                    toggleCount--;
                  }
                  areaToggle[i] = !areaToggle[i];
                  if (toggleCount > 0) {
                    Array.from(photos.children).forEach((elem, i) => {
                      elem.style.display = "none";
                    });

                    areaToggle.forEach((elem, i) => {
                      if (elem) {
                        Array.from(photos.children).forEach((el, j) => {
                          if (
                            areas[i].children[1].innerHTML ==
                            el.children[0].children[1].innerHTML
                          ) {
                            console.log("hi");
                            el.style.display = `inline-block`;
                          }
                        });
                      }
                    });
                  }
                  if (toggleCount === 0) {
                    Array.from(photos.children).forEach((elem, i) => {
                      elem.style.display = `inline-block`;
                    });
                  }
                  // console.log(
                  //   areaToggle.map((el, j) => {
                  //     if (el) {
                  //       return areas[j].children[1];
                  //     }
                  //   })
                  // );
                } else {
                  areaToggle = areaToggle.map((elem, i) => {
                    if (elem) {
                      areas[i].children[0].classList.remove(`areaOn`);
                    }
                    return false;
                  });
                  Array.from(photos.children).forEach((elem, i) => {
                    elem.style.display = `inline-block`;
                  });
                  toggleCount = 0;
                }
                console.log(areaToggle);
              });
            });
          };
        }, 1000);
        loadToggle(false, 1200);
      }
    });
  });
}

function printPhotos(data, chosenCategory) {
  const photos = document.getElementById(`photos`);
  photos.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    console.log(chosenCategory);
    if (chosenCategory == -1) {
      const pic = document.createElement(`div`);
      pic.classList.add(`searchedPicture`);
      pic.style.backgroundImage = `url('${data[i].url}')`;
      pic.innerHTML = `<div class="pictureCover">
      <div class="up">${data[i].location}</div>
          <div class="down">${data[i].area}</div></div>`;
      photos.append(pic);

      const photoPopup = document.getElementById(`photoPopup`);
      const photoPopupExit = document.getElementById(`photoPopupExit`);

      pic.addEventListener(`click`, pictureClickHandler);

      photoPopupExit.addEventListener(`click`, () => {
        photoPopup.style.display = `none`;
        photoPopupContainer.style.display = `none`;
      });
    } else {
      console.log(filterListArray[chosenCategory]);
      console.log(data[i].category);
      if (filterListArray[chosenCategory] == data[i].category) {
        const pic = document.createElement(`div`);
        pic.classList.add(`searchedPicture`);
        pic.style.backgroundImage = `url('${data[i].url}')`;
        pic.innerHTML = `<div class="pictureCover">
      <div class="up">${data[i].location}</div>
          <div class="down">${data[i].area}</div></div>`;
        photos.append(pic);
        const photoPopupContainer = document.getElementById(
          `photoPopupContainer`
        );
        const photoPopup = document.getElementById(`photoPopup`);
        const photoPopupExit = document.getElementById(`photoPopupExit`);

        pic.addEventListener(`click`, pictureClickHandler);

        photoPopupExit.addEventListener(`click`, () => {
          photoPopup.style.display = `none`;
          photoPopupContainer.style.display = `none`;
        });
      }
    }
  }
}
function myPageClickEvent() {
  loadToggle(true);
  setTimeout(() => {
    const mainFrame = document.getElementById(`mainFrame`);
    const xhq = new XMLHttpRequest();
    xhq.open(`get`, `mypage.html`);
    xhq.send();
    xhq.onload = () => {
      mainFrame.innerHTML = xhq.response;
    };
    loadToggle(false, 1000);

    const mF = document.getElementById(`mainFrame`);
    const xhq2 = new XMLHttpRequest();

    xhq2.open(`get`, `mypage.html`);
    xhq2.send();
    xhq2.onload = () => {
      const xhq1 = new XMLHttpRequest();
      xhq1.open(`get`, `js/userInfo.json`);
      xhq1.send();
      xhq1.onload = () => {
        mF.innerHTML = xhq2.response;

        const upperBackground = document.getElementById(`upperBackground`);
        const lower = document.getElementById(`lower`);
        const profilePic = document.getElementById(`profilePic`);
        const nickname = document.getElementById(`nickname`);
        const writeButton = document.getElementById(`writeButton`);
        const data = JSON.parse(xhq1.responseText);
        const dataSection = document.getElementById(`dataSection`);
        console.log(data.profile.upper);
        console.log(upperBackground);
        upperBackground.style.backgroundImage = `url('${data.profile.upper}')`;
        lower.style.backgroundColor = data.profile.lower;
        profilePic.style.backgroundImage = `url('${data.profile.profilePic}')`;
        nickname.innerHTML = data.profile.nickname;

        writeButton.addEventListener(`click`, () => {
          const newNick = prompt("닉네임 설정");
          nickname.innerHTML = newNick;
        });

        pageSetting(data, "like");

        const myPageList = document.getElementById(`mypageList`);
        let prevPage = 0;

        Array.from(myPageList.children).forEach((elem, i) => {
          elem.addEventListener(`click`, () => {
            myPageList.children[prevPage].classList.remove(`liActive`);
            elem.classList.add(`liActive`);
            console.log(elem);
            if (i != prevPage && i != 2) {
              dataSection.innerHTML = "";
              const tempXhq = new XMLHttpRequest();
              tempXhq.open(`get`, `js/userInfo.json`);
              tempXhq.send();
              tempXhq.onload = () => {
                const data = JSON.parse(tempXhq.responseText);
                console.log(data);

                i === 0
                  ? pageSetting(data, `like`)
                  : pageSetting(data, `favorite`);
                prevPage = i;
              };
            } else if (i == 2 && i != prevPage) {
              dataSection.innerHTML = "";
              const newUl = document.createElement(`ul`);
              newUl.classList.add(`commentList`);
              const tempXhq = new XMLHttpRequest();
              tempXhq.open(`get`, `js/userInfo.json`);
              tempXhq.send();
              tempXhq.onload = () => {
                const data = JSON.parse(tempXhq.responseText);
                console.log(data.comment);
                for (let i = 0; i < data.comment.length; i++) {
                  const li = document.createElement(`li`);
                  li.classList.add(`comment`);
                  li.innerHTML = `<div class="detail">${
                    data.comment[i].detail
                  }</div>
                <div class="date">${
                  data.comment[data.comment.length - i - 1].date
                }</div>`;
                  newUl.append(li);
                }
                dataSection.append(newUl);
                prevPage = i;
              };
            }
          });
        });
      };
    };
  }, 1000);
}
function pageSetting(data, chosen) {
  for (let i = 0; i < data[chosen].length; i++) {
    const pic = document.createElement(`div`);
    pic.classList.add(`picture`);
    pic.style.backgroundImage = `url('${data.like[i].url}')`;
    pic.innerHTML = `<div class="pictureCover">
                  <div class="up">${data[chosen][i].location}</div>
                      <div class="down">${data[chosen][i].area}</div></div>`;
    dataSection.append(pic);
    const photoPopup = document.getElementById(`photoPopup`);
    const photoPopupExit = document.getElementById(`photoPopupExit`);

    pic.addEventListener(`click`, pictureClickHandler);
    photoPopupExit.addEventListener(`click`, () => {
      photoPopup.style.display = `none`;
    });
  }
}
function pictureClickHandler() {
  const photoPopupContainer = document.getElementById(`photoPopupContainer`);
  if (!!photoPopupContainer) {
    photoPopupContainer.style.display = `block`;
  }
  photoPopup.style.display = "flex";
  const $url = this.style.backgroundImage;
  const $loc = this.children[0].children[0].innerHTML;
  photoPopup.children[0].style.backgroundImage = $url;
  photoPopup.children[1].children[1].innerHTML = $loc;
}
function loginButtonSetting() {
  const login = document.getElementById(`login`);
  const loginPopup = document.getElementById(`loginPopupContainer`);
  const loginExitButton = document.getElementById(`loginExitButton`);

  login.addEventListener(`click`, () => {
    loginPopup.style.display = `flex`;
  });
  loginExitButton.addEventListener(`click`, () => {
    loginPopup.style.display = `none`;
  });
}

//true -> intro On, false -> intro Off
function loadToggle(boolean, delay) {
  const intro = document.getElementById(`intro`);
  if (boolean) {
    intro.style.display = `flex`;
  }
  intro.animate(
    [
      {
        opacity: boolean ? 0 : 1
      },
      {
        opacity: boolean ? 1 : 0
      }
    ],
    {
      delay: delay,
      duration: 1000,
      fill: `forwards`
    }
  );
  if (delay) {
    setTimeout(() => {
      intro.style.display = "none";
    }, delay + 2000);
  }
}

function mainPageSetting() {
  const picArea = document.getElementById(`mainBox`);

  const xhq = new XMLHttpRequest();
  xhq.open(`get`, `js/data.json`);
  xhq.send();
  xhq.onload = () => {
    console.log(`hi`);
    const data = JSON.parse(xhq.responseText);
    console.log(data[Math.floor(Math.random() * data.length)].url);
    const ranUrl = data[Math.floor(Math.random() * (data.length - 1)) + 1].url;
    picArea.style.backgroundImage = `url('${ranUrl}')`;
    picArea.animate(
      [
        {
          opacity: 1
        },
        {
          opacity: 0,
          offset: 0.2
        },
        {
          opacity: 1,
          offset: 0.4
        },
        {
          opacity: 1
        }
      ],
      {
        duration: 6000,
        iterations: Infinity
      }
    );
    let mainCount = 1;
    setInterval(() => {
      setTimeout(() => {
        picArea.style.backgroundImage = `url('${data[mainCount].url}')`;
        mainCount++;
        if (mainCount == data.length) {
          mainCount = 0;
        }
      }, 1200);
    }, 6000);
  };
}

window.onload = init;
