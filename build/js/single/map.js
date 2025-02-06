function init() {
  const center = [45.042642, 41.962202];
  const myMap = new ymaps.Map('map', {
    center: center,
    zoom: 15,
  });

  const myPlacemark = new ymaps.Placemark(
    center,
    {},
    {
      preset: 'islands#redLeisureCircleIcon',
    },
  );

  myMap.controls.remove('searchControl');
  myMap.geoObjects.add(myPlacemark);
}

ymaps.ready(init);
