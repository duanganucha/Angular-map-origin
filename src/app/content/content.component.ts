import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'
import {CalendarService} from "../services/calendar.service";
import { CalComponies } from "../model/cal_componies.model";


declare var google: any;


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  private calendarName: string;
  private subscription: Subscription;
  private map: any;


  constructor( private calService: CalendarService) {

  }

  ngOnInit(): void {
   
    this.initMap();
  }

  public initMap(): void {
    var mapCanvas = document.getElementById("map");
    var marker = new google.maps.Marker();
    var myCenter = new google.maps.LatLng(0, 0);
    var mapOptions = {
      center: myCenter,
      zoom: 10
    }
    this.map = new google.maps.Map(mapCanvas, mapOptions);

    this.calService.getCalendar().then((response: any) => {

      //Avvalorare company dal servizio trovando quello che ci serve
      let company: CalComponies = null;
      let companies = response.json();
      companies.forEach(element => {
        if (element.name_company === this.calendarName) {
          company = element;
          return false;
        }
      });

      var mapOptions = {
        center: new google.maps.LatLng(company.markers[0].lat, company.markers[0].lng),
        zoom: 10
      }
      this.map = new google.maps.Map(mapCanvas, mapOptions);
      //Click sulla mappa
      this.map.addListener('click', (event) => {
        alert('Latitudine: ' + event.latLng.lat() + '\nLongitudine: ' + event.latLng.lng());
      });

      company.markers.forEach(el => {
        if (el !== undefined) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(el.lat, el.lng),
            map: this.map,
            title: el.description,
            animation: google.maps.Animation.BOUNCE
          });
          google.maps.event.addListener(marker, 'click', (function (marker) {
            var infowindow = new google.maps.InfoWindow();
            return function () {
              infowindow.setContent(el.description);
              infowindow.open(this.map, marker);
            }
          })(marker));
        }
      });
      marker.setMap(this.map);
    })
  }

  zoomIn() {
    this.map.setZoom(this.map.getZoom() + 1);
  }
  zoomOut() {
    this.map.setZoom(this.map.getZoom() - 1);
  }

}
