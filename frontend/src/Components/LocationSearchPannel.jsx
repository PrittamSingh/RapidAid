import "remixicon/fonts/remixicon.css";

const locations = [
  "Patna, Bihar 847429",
  "Gandhinagar, Gujarat 382010",
  "Andheri, Mumbai 400053",
  "Salt Lake, Kolkata 700091",
  "Banjara Hills, Hyderabad 500034",
  "Connaught Place, New Delhi 110001",
];

const LocationSearchPannel = (props) => {
  return (
    <div
      onClick={() => {
        props.setPannelOpen(false);
        props.setVehiclePanel(true);
      }}
      className="p-4"
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Recent Locations
      </h3>
      <div className="space-y-3">
        {locations.map((location, index) => (
          <div
            key={index}
            className="flex gap-4 items-center justify-start border border-gray-200 bg-white px-4 py-3 rounded-xl shadow hover:shadow-md transition-shadow cursor-pointer hover:border-black"
          >
            <div className="bg-[#f3f4f6] h-10 w-10 flex items-center justify-center rounded-full">
              <i className="ri-map-pin-fill text-lg text-black"></i>
            </div>
            <div className="text-gray-800 font-medium text-base">
              {location}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationSearchPannel;
