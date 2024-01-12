/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
class PuzzleDemo {
    map_;
    polys_ = [];
    difficulty_ = "Easy";
    count_ = 0;
    pieceDiv_;
    timeDiv_;
    dataLoaded_ = false;
    NUM_PIECES_ = 10;
    countries_ = [];
    timer_ = 0;
    START_COLOR_ = "#3c79de";
    END_COLOR_ = "#037e29";
    constructor(map) {
      this.map_ = map;
      this.pieceDiv_ = document.createElement("div");
      this.timeDiv_ = document.createElement("div");
      this.createMenu_();
      this.setDifficultyStyle_();
      this.loadData_();
    }
    createMenu_() {
      const menuDiv = document.createElement("div");
  
      menuDiv.style.cssText =
        "margin: 40px 10px; border-radius: 8px; height: 320px; width: 180px;" +
        "background-color: white; font-size: 14px; font-family: Roboto;" +
        "text-align: center; color: grey;line-height: 32px; overflow: hidden";
  
      const titleDiv = document.createElement("div");
  
      titleDiv.style.cssText =
        "width: 100%; background-color: #4285f4; color: white; font-size: 20px;" +
        "line-height: 40px;margin-bottom: 24px";
      titleDiv.innerText = "Game Options";
  
      const pieceTitleDiv = document.createElement("div");
  
      pieceTitleDiv.innerText = "PIECE:";
      pieceTitleDiv.style.fontWeight = "800";
  
      const pieceDiv = this.pieceDiv_;
  
      pieceDiv.innerText = "0 / " + this.NUM_PIECES_;
  
      const timeTitleDiv = document.createElement("div");
  
      timeTitleDiv.innerText = "TIME:";
      timeTitleDiv.style.fontWeight = "800";
  
      const timeDiv = this.timeDiv_;
  
      timeDiv.innerText = "0.0 seconds";
  
      const difficultyTitleDiv = document.createElement("div");
  
      difficultyTitleDiv.innerText = "DIFFICULTY:";
      difficultyTitleDiv.style.fontWeight = "800";
  
      const difficultySelect = document.createElement("select");
  
      ["Easy", "Moderate", "Hard", "Extreme"].forEach((level) => {
        const option = document.createElement("option");
  
        option.value = level.toLowerCase();
        option.innerText = level;
        difficultySelect.appendChild(option);
      });
      difficultySelect.style.cssText =
        "border: 2px solid lightgrey; background-color: white; color: #4275f4;" +
        "padding: 6px;";
      difficultySelect.onchange = () => {
        this.setDifficulty_(difficultySelect.value);
        this.resetGame_();
      };
  
      const resetDiv = document.createElement("div");
  
      resetDiv.innerText = "Reset";
      resetDiv.style.cssText =
        "cursor: pointer; border-top: 1px solid lightgrey; margin-top: 18px;" +
        "color: #4275f4; line-height: 40px; font-weight: 800";
      resetDiv.onclick = this.resetGame_.bind(this);
      menuDiv.appendChild(titleDiv);
      menuDiv.appendChild(pieceTitleDiv);
      menuDiv.appendChild(pieceDiv);
      menuDiv.appendChild(timeTitleDiv);
      menuDiv.appendChild(timeDiv);
      menuDiv.appendChild(difficultyTitleDiv);
      menuDiv.appendChild(difficultySelect);
      menuDiv.appendChild(resetDiv);
      this.map_.controls[google.maps.ControlPosition.TOP_LEFT].push(menuDiv);
    }
    render() {
      if (!this.dataLoaded_) {
        return;
      }
  
      this.start_();
    }
    loadData_() {
      const xmlhttpRequest = new XMLHttpRequest();
  
      xmlhttpRequest.onreadystatechange = () => {
        if (
          xmlhttpRequest.status != 200 ||
          xmlhttpRequest.readyState != XMLHttpRequest.DONE
        )
          return;
  
        this.loadDataComplete_(JSON.parse(xmlhttpRequest.responseText));
      };
  
      xmlhttpRequest.open(
        "GET",
        "https://geoserver.dane.gov.co/geoserver/geoportal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoportal%3Amgn2018_dpto&maxFeatures=50&outputFormat=application%2Fjson",
        true,
      );
      xmlhttpRequest.send(null);
    }
    loadDataComplete_(data) {
      this.dataLoaded_ = true;
      console.log("data",data)
      this.countries_ = data.features;
      this.start_();
    }
    /**
     * @param {string} difficulty
     * @private
     */
    setDifficulty_(difficulty) {
      this.difficulty_ = difficulty;
      if (this.map_) {
        this.setDifficultyStyle_();
      }
    }
    setDifficultyStyle_() {
      const styles = {
        easy: [
          {
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "water",
            stylers: [{ visibility: "on" }, { color: "#d4d4d4" }],
          },
          {
            featureType: "landscape",
            stylers: [{ visibility: "on" }, { color: "#e5e3df" }],
          },
          {
            featureType: "administrative.country",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "administrative.country",
            elementType: "geometry",
            stylers: [{ visibility: "on" }, { weight: 1.3 }],
          },
        ],
        moderate: [
          {
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "water",
            stylers: [{ visibility: "on" }, { color: "#d4d4d4" }],
          },
          {
            featureType: "landscape",
            stylers: [{ visibility: "on" }, { color: "#e5e3df" }],
          },
          {
            featureType: "administrative.country",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
        ],
        hard: [
          {
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "water",
            stylers: [{ visibility: "on" }, { color: "#d4d4d4" }],
          },
          {
            featureType: "landscape",
            stylers: [{ visibility: "on" }, { color: "#e5e3df" }],
          },
        ],
        extreme: [
          {
            elementType: "geometry",
            stylers: [{ visibility: "off" }],
          },
        ],
      };
  
      this.map_.set("styles", styles[this.difficulty_]);
    }
    resetGame_() {
      this.removeCountries_();
      this.count_ = 0;
      this.setCount_();
      this.startClock_();
      this.addRandomCountries_();
    }
    setCount_() {
      this.pieceDiv_.innerText = this.count_ + " / " + this.NUM_PIECES_;
      if (this.count_ == this.NUM_PIECES_) {
        this.stopClock_();
      }
    }
    stopClock_() {
      window.clearInterval(this.timer_);
    }
    startClock_() {
      this.stopClock_();
  
      const timeDiv = this.timeDiv_;
  
      if (timeDiv) timeDiv.textContent = "0.0 seconds";
  
      const t = new Date();
  
      this.timer_ = window.setInterval(() => {
        const diff = new Date().getTime() - t.getTime();
  
        if (timeDiv) timeDiv.textContent = (diff / 1000).toFixed(2) + " seconds";
      }, 100);
    }
    addRandomCountries_() {
      // Shuffle countries
      this.countries_.sort(() => {
        return Math.round(Math.random()) - 0.5;
      });
  
      const countries = this.countries_.slice(0, this.NUM_PIECES_);
  
      for (let i = 0, country; (country = countries[i]); i++) {
        this.addCountry_(country);
      }
    }
    addCountry_(country) {
        var coordinates = country.geometry.coordinates[0][0].map(function(coord) {
            console.log(coord)
            // return new google.maps.LatLng(coord[1], coord[0]);
            return new google.maps.LatLng(coord[1]+3, coord[0]-4);
            // return new google.maps.LatLng(coord[1]+(Math.floor(Math.random() * 6)), coord[0]-(Math.floor(Math.random() * 6));            
          });
        
      const options = {
        strokeColor: this.START_COLOR_,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: this.START_COLOR_,
        fillOpacity: 0.35,
        geodesic: true,
        map: this.map_,
        draggable: true,
        zIndex: 2,
        paths: coordinates,
      };
      const poly = new google.maps.Polygon(options);
  
      google.maps.event.addListener(poly, "dragend", () => {
        this.checkPosition_(poly, country);
      });
      this.polys_.push(poly);
    }
    /**
     * Checks that every point in the polygon is inside the bounds.
     */
    boundsContainsPoly_(bounds, poly) {
      const b = new google.maps.LatLngBounds(
        new google.maps.LatLng(bounds[1], bounds[0]),
        new google.maps.LatLng(bounds[3], bounds[2]),
      );
      const paths = poly.getPaths().getArray();
  
      for (let i = 0; i < paths.length; i++) {
        const p = paths[i].getArray();
  
        for (let j = 0; j < p.length; j++) {
          if (!b.contains(p[j])) {
            return false;
          }
        }
      }
      return true;
    }
    /**
     * Replace a poly with the correct 'end' position of the country.
     */
    replacePiece_(poly, country) {

        var coordinates = country.geometry.coordinates[0][0].map(function(coord) {
            console.log(coord)
            return new google.maps.LatLng(coord[1], coord[0]);
          });
        
      const options = {
        strokeColor: this.END_COLOR_,
        fillColor: this.END_COLOR_,
        draggable: false,
        zIndex: 1,
        paths: coordinates,
      };
  
      poly.setOptions(options);
      this.count_++;
      this.setCount_();
    }
    checkPosition_(poly, country) {
      if (this.boundsContainsPoly_(country.bbox, poly)) {
        this.replacePiece_(poly, country);
      }
    }
    start_() {
      this.setDifficultyStyle_();
      this.resetGame_();
    }
    removeCountries_() {
      for (let i = 0, poly; (poly = this.polys_[i]); i++) {
        poly.setMap(null);
      }
  
      this.polys_ = [];
    }
  }
  
  function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      disableDefaultUI: true,
      center: { lat: 10, lng: 60 },
      zoom: 2,
    });
  
    new PuzzleDemo(map);
  }
  
  window.initMap = initMap;
  