-- ============================================================
--  Honeybee Digital — Business Listings Dashboard
--  Database Dump
--  Generated: 2025-06-10
-- ============================================================

CREATE DATABASE IF NOT EXISTS `honeybee_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `honeybee_db`;

-- ------------------------------------------------------------
--  Table: listing_master
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `listing_master`;

CREATE TABLE `listing_master` (
  `id` INT  NOT NULL AUTO_INCREMENT,
  `business_name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `city`VARCHAR(100) NOT NULL,
  `address`VARCHAR(500) NULL,
  `phone`VARCHAR(20) NULL,
  `source`VARCHAR(100) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_city` (`city`),
  INDEX `idx_source` (`source`),
  INDEX `idx_business_name` (`business_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
--  Sample Data (50 rows — full 600 inserted via seed_db.py)
-- ------------------------------------------------------------
INSERT INTO `listing_master`
  (`business_name`, `category`, `city`, `address`, `phone`, `source`)
VALUES
  ('Spice Garden - Mumbai','Restaurants','Mumbai','12, MG Road Street, Andheri, Mumbai - 400053','+91 9876543210', 'Sulekha'),
  ('Apollo Hospitals','Hospitals','Delhi','Shop No. 45, Nehru Place Market, Delhi','+91 9988776655', 'Justdial'),
  ('Taj Hotel','Hotels','Bangalore', '7/3, Park Street Road, Near City Mall, Bangalore','+91 8877665544', 'IndiaMart'),
  ('Gold''s Gym','Gyms','Hyderabad', 'Plot 22, Sector 14, Hyderabad - 500032','+91 7766554433', 'Google Maps'),
  ('Naturals Salon','Salons','Chennai','99, Gandhi Nagar Street, Koramangala, Chennai','+91 6655443322', 'TradeIndia'),
  ('Delhi Public School','Schools','Pune','301, Ring Road Street, Banjara Hills, Pune - 411001', '+91 9123456780', 'Sulekha'),
  ('Apollo Pharmacy','Pharmacies','Kolkata','88, Station Road, Salt Lake, Kolkata - 700091','+91 8012345678', 'Justdial'),
  ('HDFC Bank','Banks','Ahmedabad', '55, Civil Lines Street, Vastrapur, Ahmedabad','+91 7901234567', 'Sulekha'),
  ('Rapid Fix Plumbing','Plumbers','Jaipur','Shop No. 11, Hazratganj Market, Jaipur','+91 9870123456', 'IndiaMart'),
  ('PowerSure Electricals','Electricians','Surat','4/7, JP Nagar Road, Near Metro Station, Surat','+91 8890123456', 'Google Maps'),
  ('Clove Dental','Dentists','Lucknow','Plot 88, Sector 22, Lucknow - 226001','+91 7780123456', 'TradeIndia'),
  ('CARS24 Service','Car Repair','Kanpur','22, Linking Road Street, Camp Area, Kanpur', '+91 9670123456', 'Sulekha'),
  ('Royal Biryani House','Restaurants', 'Nagpur','67, Banjara Hills Street, Adyar, Nagpur - 440001','+91 9560123456', 'Justdial'),
  ('Fortis Healthcare','Hospitals','Indore','Shop No. 34, Civil Lines Market, Indore','+91 8450123456', 'IndiaMart'),
  ('Oberoi Grand','Hotels','Bhopal','11/5, Anna Salai Road, Near Hospital, Bhopal','+91 7340123456', 'Google Maps'),
  ('Anytime Fitness','Gyms','Mumbai','Plot 56, Sector 8, Mumbai - 400063','+91 9230123456', 'TradeIndia'),
  ('Jawed Habib Hair & Beauty','Salons','Delhi','78, FC Road Street, Indiranagar, Delhi','+91 9120123456', 'Sulekha'),
  ('Ryan International School','Schools', 'Bangalore', 'Shop No. 22, Connaught Place Market, Bangalore','+91 8010123456', 'Justdial'),
  ('MedPlus','Pharmacies','Hyderabad', '5/1, MG Road Road, Near Bus Stand, Hyderabad','+91 7900123456', 'IndiaMart'),
  ('ICICI Bank','Banks', 'Chennai','Plot 33, Sector 19, Chennai - 600001','+91 9890123456', 'Google Maps'),
  ('AquaFlow Services','Plumbers','Pune','44, Gandhi Nagar Street, Powai, Pune - 411002','+91 8780123456', 'TradeIndia'),
  ('Bright Spark Services','Electricians','Kolkata','Shop No. 66, MG Road Market, Kolkata','+91 7670123456', 'Sulekha'),
  ('Sabka Dentist','Dentists','Ahmedabad', '9/3, Park Street Road, Near College, Ahmedabad','+91 9560123456', 'Justdial'),
  ('GoMechanic','Car Repair','Jaipur','Plot 77, Sector 30, Jaipur - 302001','+91 8450123456', 'IndiaMart'),
  ('The Curry Leaf','Restaurants','Surat','100, Ring Road Street, Whitefield, Surat - 395001','+91 9340123456', 'Google Maps'),
  ('AIIMS','Hospitals','Lucknow','Shop No. 1, Station Road Market, Lucknow','+91 8230123456', 'TradeIndia'),
  ('ITC Hotel','Hotels','Kanpur','3/2, Civil Lines Road, Near Railway Station, Kanpur', '+91 7120123456', 'Sulekha'),
  ('Cult.fit','Gyms','Nagpur','Plot 15, Sector 5, Nagpur - 440002','+91 9010123456', 'Justdial'),
  ('Lakme Salon','Salons','Indore', '55, JP Nagar Street, Gachibowli, Indore','+91 8900123456', 'IndiaMart'),
  ('Kendriya Vidyalaya','Schools','Bhopal','Shop No. 88, Hazratganj Market, Bhopal','+91 7890123456', 'Google Maps'),
  ('Netmeds Store','Pharmacies','Mumbai','6/4, Banjara Hills Road, Near Central Park, Mumbai','+91 9780123456', 'TradeIndia'),
  ('Axis Bank','Banks','Delhi', 'Plot 44, Sector 12, Delhi - 110001','+91 8670123456', 'Sulekha'),
  ('City Plumbing Works','Plumbers','Bangalore', '33, Anna Salai Street, Andheri, Bangalore','+91 7560123456', 'Justdial'),
  ('Techno Electricals','Electricians','Hyderabad', 'Shop No. 77, MG Road Market, Hyderabad','+91 9450123456', 'IndiaMart'),
  ('Perfect Smile Dental','Dentists','Chennai','8/1, Ring Road Road, Near City Mall, Chennai','+91 8340123456', 'Google Maps'),
  ('Mahindra First Choice','Car Repair','Pune','Plot 66, Sector 25, Pune - 411003','+91 7230123456', 'TradeIndia'),
  ('Masala Twist','Restaurants','Kolkata','22, FC Road Street, Salt Lake, Kolkata - 700091','+91 9120123456', 'Sulekha'),
  ('Manipal Hospital','Hospitals','Ahmedabad', 'Shop No. 55, Park Street Market, Ahmedabad','+91 8010123456', 'Justdial'),
  ('Marriott','Hotels','Jaipur','5/6, Station Road Road, Near Hospital, Jaipur','+91 7900123456', 'IndiaMart'),
  ('FITPASS Studio','Gyms','Surat','Plot 99, Sector 18, Surat - 395002','+91 9890123456', 'Google Maps'),
  ('VLCC','Salons','Lucknow','11, Gandhi Nagar Street, Vastrapur, Lucknow','+91 8780123456', 'TradeIndia'),
  ('DAV Public School','Schools','Kanpur','Shop No. 33, Civil Lines Market, Kanpur','+91 7670123456', 'Sulekha'),
  ('Wellness Forever','Pharmacies','Nagpur','7/2, MG Road Road, Near Bus Stand, Nagpur', '+91 9560123456', 'Justdial'),
  ('Kotak Mahindra Bank','Banks','Indore','Plot 22, Sector 7, Indore - 452001','+91 8450123456', 'IndiaMart'),
  ('Expert Plumbing Co.','Plumbers','Bhopal','44, JP Nagar Street, Powai, Bhopal','+91 7340123456', 'Google Maps'),
  ('Safety First Electricians','Electricians','Mumbai',    'Shop No. 66, Connaught Place Market, Mumbai',          '+91 9230123456', 'TradeIndia'),
  ('City Dental Clinic','Dentists','Delhi','9/4, Anna Salai Road, Near Metro Station, Delhi', '+91 8120123456', 'Sulekha'),
  ('Bosch Car Service', 'Car Repair','Bangalore', 'Plot 88, Sector 14, Bangalore - 560001', '+91 7010123456', 'Justdial'),
  ('Urban Dhaba','Restaurants', 'Hyderabad', '33, Ring Road Street, Indiranagar, Hyderabad','+91 9900123456', 'IndiaMart'),
  ('Max Super Speciality','Hospitals','Chennai','Shop No. 99, Station Road Market, Chennai', '+91 8890123456', 'Google Maps');

-- Useful views
CREATE OR REPLACE VIEW `v_city_wise_count` AS
  SELECT city, COUNT(*) AS count
  FROM listing_master
  GROUP BY city
  ORDER BY count DESC;

CREATE OR REPLACE VIEW `v_category_wise_count` AS
  SELECT category, COUNT(*) AS count
  FROM listing_master
  GROUP BY category
  ORDER BY count DESC;

CREATE OR REPLACE VIEW `v_source_wise_count` AS
  SELECT source, COUNT(*) AS count
  FROM listing_master
  GROUP BY source
  ORDER BY count DESC;