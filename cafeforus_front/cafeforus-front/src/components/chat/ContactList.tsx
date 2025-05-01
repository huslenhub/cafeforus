import React from "react";

const contacts = [
  { name: "Lucian Obrien", status: "online" },
  { name: "Deja Brady", status: "offline" },
  { name: "Reece Chung", status: "online" },
  { name: "Cristopher Cardenas", status: "offline" },
];

const ContactsList = () => {
  return (
    <div className="w-72 bg-gray-100 border-r p-4 overflow-y-auto h-screen">
      <h2 className="text-xl font-bold mb-4">Contacts</h2>
      <ul className="space-y-3">
        {contacts.map((contact, index) => (
          <li key={index} className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            <div>
              <p className="font-semibold">{contact.name}</p>
              <p className={`text-sm ${contact.status === "online" ? "text-green-500" : "text-gray-500"}`}>
                {contact.status}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactsList;
