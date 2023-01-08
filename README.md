# Runo-Assignment-

MongoDb campass string:"mongodb+srv://Mailarappa:XiyjAWCBrRkxLCoM@cluster0.gf6sdcb.mongodb.net/RunoAssignment"

User api:
Register user (Mandatory fields: Name, PhoneNumber, Age, Pincode, Aadhar No)
User can login through his PhoneNumber and password (set during registration)
User should be able to see the available time slots on a given day for vaccine registration (first/second dose based on his vaccination status)
Users can register a slot for the first/second dose of the vaccine (example: register for 1st dose on 1st June 11 AM). 
Users should be able to register for the second dose, only after completing their first dose of vaccine. Once the registered time slot is lapsed, the user should be considered as vaccinated for that registered dose (first/second).
User can update/change his registered slot, till 24 hours prior to his registered slot time


Admin Api:
Login using admin credentials (There won’t be any api for registering the admin. His credentials should be manually created in the database)
Check the total users registered and [filter them by Age/Pincode/Vaccination status (none/First dose completed/All completed)] - Optional
Check the registered slots for the vaccine (first dose /second dose/total) on a given day
