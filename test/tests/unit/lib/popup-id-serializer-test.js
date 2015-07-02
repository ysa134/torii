import PopupIdSerializer from 'torii/lib/popup-id-serializer';

module('PopupIdSerializer - Unit');

test('.serialize prepends a prefix before the popup id', function(){
  var popupId = "abc12345"

  equal("torii-popup:" + popupId, PopupIdSerializer.serialize(popupId));
});

test('.deserialize extracts the popup id from the serialized string', function(){
  var serializedPopupId = "torii-popup:gfedc123";

  equal("gfedc123", PopupIdSerializer.deserialize(serializedPopupId));
});

test('.deserialize returns null if not a properly serialized torii popup', function(){
  var serializedPopupId = "";

  equal(null, PopupIdSerializer.deserialize(serializedPopupId));
});

test('.serialize returns null if passed undefined', function(){
  equal(null, PopupIdSerializer.deserialize(undefined));
});
