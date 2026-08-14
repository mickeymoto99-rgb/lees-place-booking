// ==========================================
// LEE'S PLACE APARTELLE
// BOOKING WEBSITE - FRONTEND
// ==========================================

const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");
const adults = document.getElementById("adults");
const children = document.getElementById("children");
const roomType = document.getElementById("roomType");

const searchBtn = document.getElementById("searchBtn");
const searchMessage = document.getElementById("searchMessage");

const results = document.getElementById("results");
const resultSummary = document.getElementById("resultSummary");
const roomList = document.getElementById("roomList");

const booking = document.getElementById("booking");
const bookingForm = document.getElementById("bookingForm");
const selectedRoom = document.getElementById("selectedRoom");
const selectedSummary = document.getElementById("selectedSummary");
const bookingMessage = document.getElementById("bookingMessage");

const confirmation = document.getElementById("confirmation");
const bookingId = document.getElementById("bookingId");


// ==========================================
// SAMPLE ROOM DATA
// ==========================================
// This is temporary.
// Later, Google Sheets will provide the
// actual room inventory and availability.

const rooms = [
  {
    id: "ROOM-01",
    name: "Standard Room 01",
    type: "standard",
    price: 1500,
    capacity: 2,
    description: "A comfortable room for couples or individual guests.",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"
  },

  {
    id: "ROOM-02",
    name: "Standard Room 02",
    type: "standard",
    price: 1500,
    capacity: 2,
    description: "A comfortable room for couples or individual guests.",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
  },

  {
    id: "ROOM-03",
    name: "Family Room 01",
    type: "family",
    price: 2500,
    capacity: 4,
    description: "More space for families and small groups.",
    image:
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80"
  },

  {
    id: "ROOM-04",
    name: "Family Room 02",
    type: "family",
    price: 2500,
    capacity: 4,
    description: "A spacious room designed for families.",
    image:
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80"
  },

  {
    id: "ROOM-05",
    name: "Deluxe Room 01",
    type: "deluxe",
    price: 3000,
    capacity: 4,
    description: "A larger and more comfortable deluxe room.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
  }
];


// ==========================================
// DATE SETUP
// ==========================================

const today = new Date();
const todayString = today.toISOString().split("T")[0];

checkIn.min = todayString;
checkOut.min = todayString;


// ==========================================
// CHECK-IN DATE CHANGE
// ==========================================

checkIn.addEventListener("change", () => {

  if (!checkIn.value) {
    return;
  }

  checkOut.min = checkIn.value;

  if (checkOut.value && checkOut.value <= checkIn.value) {
    checkOut.value = "";
  }

});


// ==========================================
// CHECK AVAILABILITY
// ==========================================

searchBtn.addEventListener("click", () => {

  searchMessage.textContent = "";

  const arrival = checkIn.value;
  const departure = checkOut.value;

  if (!arrival || !departure) {

    searchMessage.textContent =
      "Please select your check-in and check-out dates.";

    return;
  }

  if (departure <= arrival) {

    searchMessage.textContent =
      "Check-out must be after check-in.";

    return;
  }

  const numberOfAdults = Number(adults.value);
  const numberOfChildren = Number(children.value);
  const totalGuests = numberOfAdults + numberOfChildren;

  const selectedType = roomType.value;


  // ------------------------------------------
  // TEMPORARY AVAILABILITY LOGIC
  // ------------------------------------------
  // For now, rooms are treated as available.
  //
  // Later this section will ask Google Sheets
  // which rooms are actually available.
  // ------------------------------------------

  let availableRooms = rooms.filter(room => {

    const typeMatches =
      selectedType === "all" ||
      room.type === selectedType;

    const capacityMatches =
      room.capacity >= totalGuests;

    return typeMatches && capacityMatches;

  });


  displayRooms(
    availableRooms,
    arrival,
    departure,
    numberOfAdults,
    numberOfChildren
  );

});


// ==========================================
// DISPLAY ROOMS
// ==========================================

function displayRooms(
  availableRooms,
  arrival,
  departure,
  numberOfAdults,
  numberOfChildren
) {

  results.classList.remove("hidden");

  booking.classList.add("hidden");
  confirmation.classList.add("hidden");

  roomList.innerHTML = "";

  if (availableRooms.length === 0) {

    resultSummary.textContent =
      "No rooms match your search.";

    roomList.innerHTML = `
      <div class="room-card">
        <div class="room-content">
          <h3>No rooms available</h3>
          <p class="room-description">
            Please try different dates, guest numbers,
            or another room type.
          </p>
        </div>
      </div>
    `;

    results.scrollIntoView({
      behavior: "smooth"
    });

    return;
  }


  resultSummary.textContent =
    `${availableRooms.length} room${availableRooms.length === 1 ? "" : "s"} available for your selected stay.`;


  availableRooms.forEach(room => {

    const card = document.createElement("article");

    card.className = "room-card";

    card.innerHTML = `

      <div
        class="room-image"
        style="background-image: url('${room.image}')"
      ></div>

      <div class="room-content">

        <h3>${room.name}</h3>

        <p class="room-description">
          ${room.description}
        </p>

        <div class="room-details">

          <span>
            Up to ${room.capacity} guests
          </span>

          <span class="room-price">
            ₱${room.price.toLocaleString()}
          </span>

        </div>

        <button
          class="select-room"
          data-room-id="${room.id}"
        >
          SELECT THIS ROOM
        </button>

      </div>
    `;

    roomList.appendChild(card);

  });


  // ------------------------------------------
  // SELECT ROOM BUTTONS
  // ------------------------------------------

  document.querySelectorAll(".select-room").forEach(button => {

    button.addEventListener("click", () => {

      const roomId = button.dataset.roomId;

      const room = rooms.find(
        item => item.id === roomId
      );

      if (!room) {
        return;
      }

      openBookingForm(
        room,
        arrival,
        departure,
        numberOfAdults,
        numberOfChildren
      );

    });

  });


  results.scrollIntoView({
    behavior: "smooth"
  });

}


// ==========================================
// OPEN BOOKING FORM
// ==========================================

function openBookingForm(
  room,
  arrival,
  departure,
  numberOfAdults,
  numberOfChildren
) {

  selectedRoom.value = room.id;

  selectedSummary.innerHTML = `

    <strong>${room.name}</strong><br>

    ${formatDate(arrival)}
    →
    ${formatDate(departure)}

    <br>

    ${numberOfAdults} adult${numberOfAdults === 1 ? "" : "s"}
    ·
    ${numberOfChildren} child${numberOfChildren === 1 ? "" : "ren"}

    <br>

    ₱${room.price.toLocaleString()} per night

  `;

  booking.classList.remove("hidden");

  confirmation.classList.add("hidden");

  bookingMessage.textContent = "";

  booking.scrollIntoView({
    behavior: "smooth"
  });

}


// ==========================================
// BOOKING FORM SUBMISSION
// ==========================================

bookingForm.addEventListener("submit", event => {

  event.preventDefault();

  bookingMessage.textContent = "";

  const guestName =
    document.getElementById("guestName").value.trim();

  const mobile =
    document.getElementById("mobile").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const payment =
    document.getElementById("payment").value;

  const gcashRef =
    document.getElementById("gcashRef").value.trim();

  const special =
    document.getElementById("special").value.trim();


  if (!guestName || !mobile || !email) {

    bookingMessage.textContent =
      "Please complete all required fields.";

    return;
  }


  // ------------------------------------------
  // TEMPORARY BOOKING ID
  // ------------------------------------------
  // Later Google Apps Script will generate
  // the official booking ID.
  // ------------------------------------------

  const temporaryId =
    "LP-" +
    Date.now().toString().slice(-8);


  console.log({
    bookingId: temporaryId,
    guestName,
    mobile,
    email,
    payment,
    gcashRef,
    special,
    room: selectedRoom.value,
    checkIn: checkIn.value,
    checkOut: checkOut.value,
    adults: adults.value,
    children: children.value
  });


  // ------------------------------------------
  // TEMPORARY SUCCESS
  // ------------------------------------------

  booking.classList.add("hidden");

  results.classList.add("hidden");

  confirmation.classList.remove("hidden");

  bookingId.textContent = temporaryId;

  confirmation.scrollIntoView({
    behavior: "smooth"
  });


  bookingForm.reset();

  checkOut.min = todayString;

});


// ==========================================
// DATE FORMATTER
// ==========================================

function formatDate(dateString) {

  const date = new Date(
    dateString + "T00:00:00"
  );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );

}
