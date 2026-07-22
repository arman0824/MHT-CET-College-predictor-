const fs = require('fs');
const path = require('path');

const baseColleges = [
  { code: "3012", name: "Veermata Jijabai Technological Institute (VJTI)", shortName: "VJTI", city: "Mumbai", region: "Mumbai", status: "Government Autonomous", established: 1887, fees: 84050, rating: 4.9, website: "https://vjti.ac.in", basePercentile: 99.94 },
  { code: "6006", name: "COEP Technological University (COEP)", shortName: "COEP", city: "Pune", region: "Pune", status: "Government Autonomous", established: 1854, fees: 135000, rating: 4.9, website: "https://coep.org.in", basePercentile: 99.91 },
  { code: "3215", name: "Sardar Patel Institute of Technology (SPIT)", shortName: "SPIT", city: "Mumbai", region: "Mumbai", status: "Private Autonomous", established: 1962, fees: 172000, rating: 4.8, website: "https://spit.ac.in", basePercentile: 99.82 },
  { code: "6271", name: "Pune Institute of Computer Technology (PICT)", shortName: "PICT", city: "Pune", region: "Pune", status: "Private Autonomous", established: 1983, fees: 112000, rating: 4.8, website: "https://pict.edu", basePercentile: 99.84 },
  { code: "6214", name: "Walchand College of Engineering (WCE)", shortName: "WCE", city: "Sangli", region: "Sangli/Kolhapur/Satara", status: "Government Aided Autonomous", established: 1947, fees: 85000, rating: 4.7, website: "https://walchandsangli.ac.in", basePercentile: 99.42 },
  { code: "3199", name: "Dwarkadas J. Sanghvi College of Engineering (DJSCE)", shortName: "DJSCE", city: "Mumbai", region: "Mumbai", status: "Private Autonomous", established: 1994, fees: 195000, rating: 4.7, website: "https://djsce.ac.in", basePercentile: 99.64 },
  { code: "6273", name: "Vishwakarma Institute of Technology (VIT)", shortName: "VIT Pune", city: "Pune", region: "Pune", status: "Private Autonomous", established: 1983, fees: 185000, rating: 4.6, website: "https://vit.edu", basePercentile: 99.25 },
  { code: "4115", name: "Shri Ramdeobaba College of Engineering and Management (RCOEM)", shortName: "RCOEM", city: "Nagpur", region: "Nagpur", status: "Private Autonomous", established: 1984, fees: 162000, rating: 4.6, website: "https://rknec.edu", basePercentile: 98.85 },
  { code: "3182", name: "Thadomal Shahani Engineering College (TSEC)", shortName: "TSEC", city: "Mumbai", region: "Mumbai", status: "Private", established: 1977, fees: 178000, rating: 4.5, website: "https://tsec.edu", basePercentile: 98.62 },
  { code: "3014", name: "K. J. Somaiya College of Engineering (KJSCE)", shortName: "KJSCE", city: "Mumbai", region: "Mumbai", status: "Private Autonomous", established: 1983, fees: 220000, rating: 4.6, website: "https://kjsce.somaiya.edu", basePercentile: 98.78 },
  { code: "6175", name: "Pimpri Chinchwad College of Engineering (PCCOE)", shortName: "PCCOE", city: "Pune", region: "Pune", status: "Private Autonomous", established: 1999, fees: 128000, rating: 4.5, website: "https://pccoe.org", basePercentile: 98.92 },
  { code: "6276", name: "MKSSS's Cummins College of Engineering for Women", shortName: "Cummins", city: "Pune", region: "Pune", status: "Private Autonomous", established: 1991, fees: 132000, rating: 4.6, website: "https://cumminscollege.org", basePercentile: 98.48 },
  { code: "6274", name: "Vishwakarma Institute of Information Technology (VIIT)", shortName: "VIIT", city: "Pune", region: "Pune", status: "Private Autonomous", established: 2002, fees: 165000, rating: 4.4, website: "https://viit.ac.in", basePercentile: 98.15 },
  { code: "2008", name: "Government College of Engineering, Aurangabad (GECA)", shortName: "GECA", city: "Aurangabad", region: "Aurangabad", status: "Government Autonomous", established: 1960, fees: 29000, rating: 4.3, website: "https://geca.ac.in", basePercentile: 97.85 },
  { code: "6005", name: "Government College of Engineering, Karad (GCEK)", shortName: "GCEK", city: "Karad", region: "Sangli/Kolhapur/Satara", status: "Government Autonomous", established: 1960, fees: 32000, rating: 4.2, website: "https://gcek.ac.in", basePercentile: 96.84 },
  { code: "1002", name: "Government College of Engineering, Amravati (GCEA)", shortName: "GCEA", city: "Amravati", region: "Nanded/Amravati/Jalgaon", status: "Government Autonomous", established: 1964, fees: 31000, rating: 4.1, website: "https://gcoea.ac.in", basePercentile: 95.54 },
  { code: "2020", name: "Shri Guru Gobind Singhji Institute of Engineering and Technology (SGGSIE&T)", shortName: "SGGS Nanded", city: "Nanded", region: "Nanded/Amravati/Jalgaon", status: "Government Aided Autonomous", established: 1981, fees: 82000, rating: 4.4, website: "https://sggs.ac.in", basePercentile: 96.52 },
  { code: "3135", name: "Vidyalankar Institute of Technology (VIT Mumbai)", shortName: "VIT Mumbai", city: "Mumbai", region: "Mumbai", status: "Private", established: 1999, fees: 154000, rating: 4.3, website: "https://vit.edu.in", basePercentile: 97.42 },
  { code: "3185", name: "Vivekanand Education Society's Institute of Technology (VESIT)", shortName: "VESIT", city: "Mumbai", region: "Mumbai", status: "Private", established: 1984, fees: 142000, rating: 4.4, website: "https://vesit.ves.ac.in", basePercentile: 97.82 },
  { code: "3184", name: "Fr. Conceicao Rodrigues College of Engineering (CRCE)", shortName: "Fr. CRCE", city: "Mumbai", region: "Mumbai", status: "Private", established: 1984, fees: 158000, rating: 4.3, website: "https://frcrce.ac.in", basePercentile: 97.22 },
  { code: "6178", name: "Sinhgad College of Engineering (SCOE)", shortName: "SCOE", city: "Pune", region: "Pune", status: "Private", established: 1996, fees: 114000, rating: 4.1, website: "https://sinhgad.edu", basePercentile: 92.52 },
  { code: "6272", name: "D. Y. Patil College of Engineering, Akurdi (DYPCOE)", shortName: "DYPCOE", city: "Pune", region: "Pune", status: "Private", established: 1984, fees: 125000, rating: 4.3, website: "https://dypcoeakurdi.ac.in", basePercentile: 96.22 },
  { code: "6146", name: "MIT Academy of Engineering (MITAOE)", shortName: "MITAOE", city: "Pune", region: "Pune", status: "Private Autonomous", established: 1999, fees: 168000, rating: 4.2, website: "https://mitaoe.ac.in", basePercentile: 95.42 },
  { code: "4116", name: "G. H. Raisoni College of Engineering, Nagpur", shortName: "GH Raisoni Nagpur", city: "Nagpur", region: "Nagpur", status: "Private Autonomous", established: 1996, fees: 145000, rating: 4.2, website: "https://ghrce.raisoni.net", basePercentile: 92.22 },
  { code: "5121", name: "K. K. Wagh Institute of Engineering Education and Research", shortName: "K.K. Wagh", city: "Nashik", region: "Nashik", status: "Private Autonomous", established: 1984, fees: 122000, rating: 4.4, website: "https://kkwagh.edu.in", basePercentile: 95.02 },
  { code: "3210", name: "K. J. Somaiya Institute of Technology (KJSIT)", shortName: "KJSIT", city: "Mumbai", region: "Mumbai", status: "Private", established: 2001, fees: 168000, rating: 4.2, website: "https://kjsit.somaiya.edu", basePercentile: 96.52 },
  { code: "3207", name: "Don Bosco Institute of Technology (DBIT)", shortName: "DBIT", city: "Mumbai", region: "Mumbai", status: "Private", established: 2001, fees: 135000, rating: 4.1, website: "https://dbit.in", basePercentile: 94.22 },
  { code: "3147", name: "Lokmanya Tilak College of Engineering (LTCE)", shortName: "LTCE", city: "Navi Mumbai", region: "Mumbai", status: "Private", established: 1994, fees: 122000, rating: 3.9, website: "https://ltce.in", basePercentile: 90.52 },
  { code: "3220", name: "SIES Graduate School of Technology (SIESGST)", shortName: "SIESGST", city: "Navi Mumbai", region: "Mumbai", status: "Private", established: 2002, fees: 138000, rating: 4.2, website: "https://siesgst.edu.in", basePercentile: 95.12 },
  { code: "3187", name: "Datta Meghe College of Engineering (DMCE)", shortName: "DMCE", city: "Navi Mumbai", region: "Mumbai", status: "Private", established: 1988, fees: 110000, rating: 3.8, website: "https://dmce.ac.in", basePercentile: 88.52 },
  { code: "3145", name: "Pillai College of Engineering (PCE)", shortName: "PCE Panvel", city: "New Panvel", region: "Mumbai", status: "Private", established: 1999, fees: 128000, rating: 4.1, website: "https://pce.ac.in", basePercentile: 91.22 },
  { code: "3139", name: "Rajiv Gandhi Institute of Technology (RGIT)", shortName: "RGIT", city: "Mumbai", region: "Mumbai", status: "Private", established: 1992, fees: 124000, rating: 4.0, website: "https://mctrgit.ac.in", basePercentile: 92.42 },
  { code: "3190", name: "Atharva College of Engineering (ACE)", shortName: "ACE", city: "Mumbai", region: "Mumbai", status: "Private", established: 1999, fees: 128000, rating: 3.8, website: "https://atharvacoe.ac.in", basePercentile: 87.52 },
  { code: "3154", name: "St. Francis Institute of Technology (SFIT)", shortName: "SFIT", city: "Mumbai", region: "Mumbai", status: "Private", established: 1999, fees: 134000, rating: 4.2, website: "https://sfit.ac.in", basePercentile: 93.82 },
  { code: "6184", name: "Smt. Kashibai Navale College of Engineering (SKNCOE)", shortName: "SKNCOE", city: "Pune", region: "Pune", status: "Private", established: 2001, fees: 102000, rating: 3.9, website: "http://www.sinhgad.edu", basePercentile: 88.22 },
  { code: "6207", name: "JSPM's Rajarshi Shahu College of Engineering (RSCOE)", shortName: "RSCOE", city: "Pune", region: "Pune", status: "Private Autonomous", established: 2001, fees: 118000, rating: 4.1, website: "https://rscoe.jspm.edu.in", basePercentile: 93.52 },
  { code: "6144", name: "PDEA's College of Engineering", shortName: "PDEA COE", city: "Pune", region: "Pune", status: "Private", established: 1998, fees: 82000, rating: 3.7, website: "http://pdeacoepune.org", basePercentile: 83.22 },
  { code: "6181", name: "PES's Modern College of Engineering", shortName: "Modern COE", city: "Pune", region: "Pune", status: "Private", established: 1999, fees: 108000, rating: 4.0, website: "https://moderncoe.edu.in", basePercentile: 91.82 },
  { code: "6141", name: "Trinity College of Engineering and Research", shortName: "Trinity COE", city: "Pune", region: "Pune", status: "Private", established: 2008, fees: 88000, rating: 3.6, website: "https://kjei.edu.in/tcoer", basePercentile: 78.52 },
  { code: "6289", name: "Zeal College of Engineering and Research", shortName: "Zeal COER", city: "Pune", region: "Pune", status: "Private", established: 2007, fees: 94000, rating: 3.8, website: "https://zealeducation.com", basePercentile: 81.22 },
  { code: "6150", name: "Genba Sopanrao Moze College of Engineering", shortName: "Moze COE", city: "Pune", region: "Pune", status: "Private", established: 1999, fees: 74000, rating: 3.3, website: "http://gsmozecoe.org", basePercentile: 71.52 },
  { code: "6206", name: "Dr. D. Y. Patil Institute of Technology, Pimpri", shortName: "DYPIT Pimpri", city: "Pune", region: "Pune", status: "Private", established: 1998, fees: 118000, rating: 4.2, website: "https://engg.dypvp.edu.in", basePercentile: 94.82 },
  { code: "6145", name: "G H Raisoni College of Engineering and Management, Pune", shortName: "GHRCEM Pune", city: "Pune", region: "Pune", status: "Private Autonomous", established: 2006, fees: 124000, rating: 3.9, website: "https://ghrcem.raisoni.net", basePercentile: 84.52 },
  { code: "4118", name: "Yeshwantrao Chavan College of Engineering (YCCE)", shortName: "YCCE", city: "Nagpur", region: "Nagpur", status: "Private Autonomous", established: 1984, fees: 154000, rating: 4.3, website: "https://ycce.edu", basePercentile: 93.82 },
  { code: "4005", name: "Laxminarayan Institute of Technology (LIT)", shortName: "LIT Nagpur", city: "Nagpur", region: "Nagpur", status: "Government", established: 1942, fees: 38000, rating: 4.4, website: "https://litnagpur.in", basePercentile: 97.22 },
  { code: "4147", name: "KDK College of Engineering", shortName: "KDKCE", city: "Nagpur", region: "Nagpur", status: "Private", established: 1984, fees: 98000, rating: 3.7, website: "http://www.kdkce.edu", basePercentile: 79.52 },
  { code: "4123", name: "Priyadarshini College of Engineering", shortName: "PCE Nagpur", city: "Nagpur", region: "Nagpur", status: "Private", established: 1990, fees: 104000, rating: 3.8, website: "http://www.pcenagpur.edu.in", basePercentile: 81.22 },
  { code: "4174", name: "St. Vincent Pallotti College of Engineering and Technology", shortName: "SVPCET", city: "Nagpur", region: "Nagpur", status: "Private", established: 2004, fees: 112000, rating: 4.1, website: "https://stvincentpallotti.edu.in", basePercentile: 85.52 },
  { code: "4112", name: "JD College of Engineering and Management", shortName: "JDCOEM", city: "Nagpur", region: "Nagpur", status: "Private Autonomous", established: 2008, fees: 92000, rating: 3.8, website: "https://jdcoem.ac.in", basePercentile: 80.82 },
  { code: "4143", name: "S B Jain Institute of Technology, Management and Research", shortName: "SBJITMR", city: "Nagpur", region: "Nagpur", status: "Private", established: 2008, fees: 89000, rating: 3.7, website: "http://www.sbjit.edu.in", basePercentile: 82.52 },
  { code: "4167", name: "Nagpur Institute of Technology", shortName: "NIT Nagpur", city: "Nagpur", region: "Nagpur", status: "Private", established: 2008, fees: 72000, rating: 3.4, website: "http://nitnagpur.edu.in", basePercentile: 76.22 },
  { code: "5109", name: "Sandip Institute of Technology and Research Centre", shortName: "Sandip SITRC", city: "Nashik", region: "Nashik", status: "Private", established: 2008, fees: 94000, rating: 3.9, website: "https://sandipfoundation.org", basePercentile: 83.52 },
  { code: "5130", name: "MET League of Colleges, Bhujbal Knowledge City", shortName: "MET BKC", city: "Nashik", region: "Nashik", status: "Private", established: 2006, fees: 108000, rating: 4.1, website: "https://metbkc.edu.in", basePercentile: 87.22 },
  { code: "5124", name: "Guru Gobind Singh Foundation's College of Engineering", shortName: "GGSF COE", city: "Nashik", region: "Nashik", status: "Private", established: 2013, fees: 76000, rating: 3.6, website: "http://www.ggsf.edu.in", basePercentile: 78.22 },
  { code: "5105", name: "NDMVP Samaj's KBT College of Engineering", shortName: "KBT COE", city: "Nashik", region: "Nashik", status: "Private", established: 1999, fees: 92000, rating: 4.0, website: "https://kbtcoe.org", basePercentile: 86.82 },
  { code: "5179", name: "SNJB's Late Sau. Kantabai Bhavarlalji Jain College of Engineering", shortName: "SNJB COE", city: "Nashik", region: "Nashik", status: "Private", established: 2004, fees: 86000, rating: 3.8, website: "https://snjb.org/engineering", basePercentile: 82.22 },
  { code: "5125", name: "Matoshri College of Engineering and Research Centre", shortName: "Matoshri COE", city: "Nashik", region: "Nashik", status: "Private", established: 2008, fees: 78000, rating: 3.5, website: "http://gcoematoshri.co.in", basePercentile: 75.52 },
  { code: "2014", name: "PES College of Engineering", shortName: "PES COE", city: "Aurangabad", region: "Aurangabad", status: "Private", established: 1994, fees: 82000, rating: 3.7, website: "http://pescoe.ac.in", basePercentile: 81.22 },
  { code: "2025", name: "MGM's Jawaharlal Nehru Engineering College", shortName: "JNEC", city: "Aurangabad", region: "Aurangabad", status: "Private", established: 1983, fees: 148000, rating: 4.2, website: "https://jnec.org", basePercentile: 87.82 },
  { code: "2012", name: "Deogiri Institute of Engineering and Management Studies", shortName: "DIEMS", city: "Aurangabad", region: "Aurangabad", status: "Private", established: 2009, fees: 92000, rating: 3.9, website: "https://dietms.org", basePercentile: 83.22 },
  { code: "2015", name: "Hi-Tech Institute of Technology", shortName: "HITECH", city: "Aurangabad", region: "Aurangabad", status: "Private", established: 2001, fees: 68000, rating: 3.3, website: "http://hitechengg.edu.in", basePercentile: 72.52 },
  { code: "2019", name: "Shreeyash College of Engineering & Technology", shortName: "Shreeyash COET", city: "Aurangabad", region: "Aurangabad", status: "Private", established: 2008, fees: 75000, rating: 3.5, website: "http://sycet.org", basePercentile: 73.82 },
  { code: "6267", name: "Kolhapur Institute of Technology's College of Engineering (KIT)", shortName: "KIT Kolhapur", city: "Kolhapur", region: "Sangli/Kolhapur/Satara", status: "Private Autonomous", established: 1983, fees: 114000, rating: 4.2, website: "https://kitcoek.in", basePercentile: 91.22 },
  { code: "6250", name: "D. Y. Patil College of Engineering and Technology, Kolhapur", shortName: "DYPCET Kolhapur", city: "Kolhapur", region: "Sangli/Kolhapur/Satara", status: "Private", established: 1984, fees: 96000, rating: 4.0, website: "https://coek.dypgroup.edu.in", basePercentile: 86.52 },
  { code: "6215", name: "Rajarambapu Institute of Technology (RIT)", shortName: "RIT Sakharale", city: "Sakharale", region: "Sangli/Kolhapur/Satara", status: "Private Autonomous", established: 1983, fees: 122000, rating: 4.2, website: "https://ritindia.edu", basePercentile: 89.22 },
  { code: "6211", name: "Satara College of Engineering", shortName: "Satara COE", city: "Satara", region: "Sangli/Kolhapur/Satara", status: "Private", established: 1999, fees: 71000, rating: 3.4, website: "http://sataracoe.org", basePercentile: 74.82 },
  { code: "6149", name: "Yashoda Technical Campus", shortName: "YTC Satara", city: "Satara", region: "Sangli/Kolhapur/Satara", status: "Private", established: 2011, fees: 78000, rating: 3.5, website: "https://yeshoda.edu.in", basePercentile: 76.52 },
  { code: "1125", name: "Prof. Ram Meghe Institute of Technology and Research", shortName: "Ram Meghe PRMITR", city: "Amravati", region: "Nanded/Amravati/Jalgaon", status: "Private Autonomous", established: 1983, fees: 115000, rating: 4.1, website: "https://mitra.ac.in", basePercentile: 87.82 },
  { code: "1126", name: "G.H. Raisoni College of Engineering and Management, Amravati", shortName: "GHRCEM Amravati", city: "Amravati", region: "Nanded/Amravati/Jalgaon", status: "Private", established: 2008, fees: 82000, rating: 3.5, website: "https://ghrcema.raisoni.net", basePercentile: 76.52 },
  { code: "5004", name: "Government College of Engineering, Jalgaon", shortName: "GCE Jalgaon", city: "Jalgaon", region: "Nanded/Amravati/Jalgaon", status: "Government Autonomous", established: 1996, fees: 34000, rating: 4.1, website: "http://gcoej.ac.in", basePercentile: 92.22 },
  { code: "5104", name: "SSBT's College of Engineering and Technology", shortName: "SSBT COET Jalgaon", city: "Jalgaon", region: "Nanded/Amravati/Jalgaon", status: "Private", established: 1983, fees: 76000, rating: 3.7, website: "https://sscoetjalgaon.ac.in", basePercentile: 78.52 },
  { code: "5172", name: "R. C. Patel Institute of Technology (RCPIT)", shortName: "RCPIT Shirpur", city: "Shirpur", region: "Nanded/Amravati/Jalgaon", status: "Private Autonomous", established: 2001, fees: 112000, rating: 4.2, website: "https://rcpit.ac.in", basePercentile: 89.52 },
  { code: "6223", name: "Walchand Institute of Technology (WIT Solapur)", shortName: "WIT Solapur", city: "Solapur", region: "Other", status: "Private Autonomous", established: 1983, fees: 108000, rating: 4.2, website: "https://witsolapur.org", basePercentile: 88.22 },
  { code: "6220", name: "Nagesh Karajagi Orchid College of Engineering", shortName: "NK Orchid Solapur", city: "Solapur", region: "Other", status: "Private", established: 2008, fees: 84000, rating: 3.7, website: "http://orchidengg.ac.in", basePercentile: 81.52 },
  { code: "6224", name: "Sinhgad Institute of Technology (SIT Lonavala)", shortName: "SIT Lonavala", city: "Lonavala", region: "Pune", status: "Private", established: 2004, fees: 98000, rating: 3.6, website: "http://www.sinhgad.edu", basePercentile: 80.22 },
  { code: "6225", name: "Smt. Kashibai Navale College of Engineering, Lonavala", shortName: "SKN Lonavala", city: "Lonavala", region: "Pune", status: "Private", established: 2004, fees: 92000, rating: 3.5, website: "http://www.sinhgad.edu", basePercentile: 78.82 },
  { code: "6155", name: "G. H. Raisoni College of Engineering and Management, Wagholi", shortName: "GHRCEM Wagholi Pune", city: "Pune", region: "Pune", status: "Private Autonomous", established: 2006, fees: 114000, rating: 3.9, website: "https://ghrcem.raisoni.net", basePercentile: 85.82 },
  { code: "6182", name: "Sinhgad Academy of Engineering, Kondhwa", shortName: "Sinhgad Kondhwa Pune", city: "Pune", region: "Pune", status: "Private", established: 2005, fees: 96000, rating: 3.8, website: "http://www.sinhgad.edu", basePercentile: 83.52 },
  { code: "6156", name: "D. Y. Patil School of Engineering, Lohegaon", shortName: "DYP Lohegaon Pune", city: "Pune", region: "Pune", status: "Private", established: 2010, fees: 92000, rating: 3.7, website: "http://dypsoe.in", basePercentile: 82.82 },
  { code: "6284", name: "Trinity Academy of Engineering, Pune", shortName: "Trinity Academy Pune", city: "Pune", region: "Pune", status: "Private", established: 2010, fees: 82000, rating: 3.5, website: "https://kjei.edu.in/tae", basePercentile: 76.22 },
  { code: "6143", name: "Alard College of Engineering and Management", shortName: "Alard Pune", city: "Pune", region: "Pune", status: "Private", established: 2009, fees: 76000, rating: 3.3, website: "https://alardinstitutes.com", basePercentile: 72.52 },
  { code: "6147", name: "ISB&M School of Technology, Nande", shortName: "ISB&M Pune", city: "Pune", region: "Pune", status: "Private", established: 2008, fees: 88000, rating: 3.5, website: "http://www.isbm.edu.in", basePercentile: 77.82 },
  { code: "6203", name: "Keystone School of Engineering", shortName: "Keystone Pune", city: "Pune", region: "Pune", status: "Private", established: 2012, fees: 74000, rating: 3.4, website: "http://keystoneedu.in", basePercentile: 73.22 },
  { code: "6221", name: "Nutan Maharashtra Institute of Engineering and Technology", shortName: "Nutan NMIET Talegaon Pune", city: "Pune", region: "Pune", status: "Private", established: 1998, fees: 92000, rating: 3.9, website: "http://nmiet.edu.in", basePercentile: 84.52 },
  { code: "6222", name: "Nutan College of Engineering and Research", shortName: "Nutan NCER Talegaon Pune", city: "Pune", region: "Pune", status: "Private Autonomous", established: 2018, fees: 98000, rating: 3.8, website: "http://ncerpune.in", basePercentile: 82.82 },
  { code: "3141", name: "Bharat College of Engineering, Badlapur", shortName: "Bharat Badlapur", city: "Badlapur", region: "Mumbai", status: "Private", established: 2009, fees: 76000, rating: 3.2, website: "http://bharatedu.co.in", basePercentile: 70.22 },
  { code: "3142", name: "G.V. Acharya Institute of Engineering, Karjat", shortName: "GV Acharya Karjat", city: "Karjat", region: "Mumbai", status: "Private", established: 2009, fees: 68000, rating: 3.0, website: "http://gvacharya.edu.in", basePercentile: 64.52 },
  { code: "3143", name: "Dilkap Research Institute of Engineering, Karjat", shortName: "Dilkap Karjat", city: "Karjat", region: "Mumbai", status: "Private", established: 2010, fees: 68000, rating: 3.0, website: "http://driems.in", basePercentile: 63.82 },
  { code: "3144", name: "Yadavrao Tasgaonkar Institute of Engineering, Karjat", shortName: "Yadavrao Tasgaonkar Karjat", city: "Karjat", region: "Mumbai", status: "Private", established: 2005, fees: 71000, rating: 3.0, website: "http://tasgaonkar.edu.in", basePercentile: 62.52 },
  { code: "3156", name: "Saraswati College of Engineering, Kharghar", shortName: "Saraswati Kharghar", city: "Navi Mumbai", region: "Mumbai", status: "Private", established: 2004, fees: 94000, rating: 3.9, website: "https://sce.edu.in", basePercentile: 81.52 },
  { code: "3157", name: "Chhatrapati Shivaji Maharaj Institute of Technology, Panvel", shortName: "CSMIT Panvel", city: "Panvel", region: "Mumbai", status: "Private", established: 2014, fees: 76000, rating: 3.3, website: "http://csmit.in", basePercentile: 71.22 },
  { code: "3183", name: "K. C. College of Engineering and Management, Thane", shortName: "KC Thane", city: "Thane", region: "Mumbai", status: "Private", established: 2001, fees: 98000, rating: 3.9, website: "https://kccoe.edu.in", basePercentile: 83.82 },
  { code: "3196", name: "Terna Engineering College, Nerul", shortName: "Terna Nerul", city: "Navi Mumbai", region: "Mumbai", status: "Private Autonomous", established: 1991, fees: 128000, rating: 4.1, website: "https://ternaengg.ac.in", basePercentile: 88.52 },
  { code: "3197", name: "A. C. Patil College of Engineering (ACPCE)", shortName: "ACPCE Navi Mumbai", city: "Navi Mumbai", region: "Mumbai", status: "Private", established: 1992, fees: 114000, rating: 3.7, website: "http://acpce.edu.in", basePercentile: 79.22 },
  { code: "3198", name: "MGM's College of Engineering and Technology, Kamothe", shortName: "MGM Kamothe", city: "Navi Mumbai", region: "Mumbai", status: "Private", established: 1982, fees: 110000, rating: 3.8, website: "https://mgmmumbai.ac.in/mgmcet", basePercentile: 84.52 },
  { code: "3211", name: "Shri L.R. Tiwari College of Engineering, Mira Road", shortName: "LR Tiwari Mira Road", city: "Mira Road", region: "Mumbai", status: "Private", established: 2010, fees: 94000, rating: 3.8, website: "https://slrtce.in", basePercentile: 82.82 },
  { code: "3222", name: "Universal College of Engineering, Vasai", shortName: "Universal Vasai", city: "Vasai", region: "Mumbai", status: "Private", established: 2012, fees: 94000, rating: 3.7, website: "https://universalcollegeofengineering.edu.in", basePercentile: 79.52 },
  { code: "3223", name: "Viva Institute of Technology, Virar", shortName: "Viva Virar", city: "Virar", region: "Mumbai", status: "Private", established: 2009, fees: 82000, rating: 3.6, website: "http://www.viva-technology.org", basePercentile: 76.82 },
  { code: "3224", name: "New Horizon Institute of Technology and Management, Thane", shortName: "New Horizon Thane", city: "Thane", region: "Mumbai", status: "Private", established: 2014, fees: 92000, rating: 3.7, website: "http://nhitm.ac.in", basePercentile: 80.52 },
  { code: "3225", name: "Jawahar Education Society's A.C. Patil College of Engineering, Kharghar", shortName: "ACPCE Kharghar", city: "Navi Mumbai", region: "Mumbai", status: "Private", established: 1992, fees: 98000, rating: 3.6, website: "http://acpce.edu.in", basePercentile: 78.22 },
  { code: "3226", name: "Anjuman-I-Islam's Kalsekar Technical Campus, Panvel", shortName: "Kalsekar Panvel", city: "Panvel", region: "Mumbai", status: "Private", established: 2011, fees: 88000, rating: 3.7, website: "http://aiktc.ac.in", basePercentile: 79.82 },
  { code: "6226", name: "Bharati Vidyapeeth's College of Engineering, Lavale", shortName: "BVCOE Lavale Pune", city: "Pune", region: "Pune", status: "Private", established: 2012, fees: 92000, rating: 3.7, website: "http://bvcoe.bharatividyapeeth.edu", basePercentile: 82.22 },
  { code: "5135", name: "G. H. Raisoni Institute of Engineering and Business Management, Jalgaon", shortName: "GHRIBM Jalgaon", city: "Jalgaon", region: "Nanded/Amravati/Jalgaon", status: "Private", established: 2008, fees: 72000, rating: 3.4, website: "https://ghriebm.raisoni.net", basePercentile: 72.82 },
  { code: "5136", name: "Godavari College of Engineering, Jalgaon", shortName: "Godavari Jalgaon", city: "Jalgaon", region: "Nanded/Amravati/Jalgaon", status: "Private", established: 1999, fees: 68000, rating: 3.2, website: "http://gcoejal.org", basePercentile: 68.52 },
  { code: "1105", name: "Shri Sant Gajanan Maharaj College of Engineering, Shegaon", shortName: "SSGM Shegaon", city: "Shegaon", region: "Nanded/Amravati/Jalgaon", status: "Private Autonomous", established: 1983, fees: 110000, rating: 4.3, website: "https://ssgmce.ac.in", basePercentile: 95.22 }
];

const branchesConfig = [
  { id: "CS", name: "Computer Engineering", offset: 0.0 },
  { id: "IT", name: "Information Technology", offset: -0.4 },
  { id: "AIDS", name: "Artificial Intelligence & Data Science", offset: -0.8 },
  { id: "AIML", name: "CSE (AI & Machine Learning)", offset: -1.1 },
  { id: "ENTC", name: "Electronics & Telecommunication", offset: -2.0 },
  { id: "EE", name: "Electrical Engineering", offset: -4.5 },
  { id: "ME", name: "Mechanical Engineering", offset: -6.5 },
  { id: "CE", name: "Civil Engineering", offset: -8.0 },
  { id: "CH", name: "Chemical Engineering", offset: -7.5 }
];

function percentileToRank(p) {
  if (p >= 100) return 1;
  if (p < 0) p = 0;
  if (p >= 99.9) {
    return Math.max(1, Math.round((100 - p) * 1500));
  } else if (p >= 99.0) {
    return Math.round(150 + (99.9 - p) * 1500);
  } else if (p >= 95.0) {
    return Math.round(1500 + (99.0 - p) * 1625);
  } else if (p >= 90.0) {
    return Math.round(8000 + (95.0 - p) * 1600);
  } else if (p >= 80.0) {
    return Math.round(16000 + (90.0 - p) * 1900);
  } else if (p >= 70.0) {
    return Math.round(35000 + (80.0 - p) * 2000);
  } else if (p >= 50.0) {
    return Math.round(55000 + (70.0 - p) * 2250);
  } else {
    return Math.round(100000 + (50.0 - p) * 2500);
  }
}

// Generate the complete output database
const colleges = baseColleges.map((col, index) => {
  const isGovernment = col.status.includes("Government");
  
  // Decide which branches are available for this college.
  // Government/high-tier colleges have almost all branches.
  // Lower tier private colleges might only have IT/CS/AIDS/AIML/ENTC.
  let availableBranches = [...branchesConfig];
  if (col.basePercentile < 80.0) {
    availableBranches = branchesConfig.filter(b => ["CS", "IT", "AIDS", "AIML", "ENTC"].includes(b.id));
  }
  
  // High tier special: LIT Nagpur is chemical specific, let's keep only chemical/CS/IT
  if (col.shortName === "LIT Nagpur") {
    availableBranches = branchesConfig.filter(b => ["CS", "CH", "ENTC"].includes(b.id));
    // Boost chemical base for LIT
    const chB = availableBranches.find(b => b.id === "CH");
    if (chB) chB.offset = 1.0; 
  }

  const branches = availableBranches.map(br => {
    // 2025 General base
    let base2025 = col.basePercentile + br.offset;
    if (base2025 > 99.99) base2025 = 99.98;
    if (base2025 < 40.0) base2025 = 40.0 + (index % 10); // clamp min

    // 2024 cutoff (slight historical fluctuation)
    const fluctuation = (Math.sin(index + br.id.charCodeAt(0)) * 0.25); // -0.25 to +0.25
    let base2024 = base2025 + fluctuation;
    if (base2024 > 99.99) base2024 = 99.97;
    if (base2024 < 35.0) base2024 = 35.0;

    const generateCategories = (baseP) => {
      // Categories: GOPENH, GOPENO, LOPENH, LOPENO, OBC, SC, ST, TFWS
      // GOPENH / GOPENO depends on Home University vs Other than Home University.
      // Autonomous colleges or state level colleges (COEP, VJTI, SGGS) usually have State level seats,
      // so GOPENH and GOPENO are very close or same.
      const isAutonomous = col.status.includes("Autonomous");
      
      const gopenh = Number(baseP.toFixed(4));
      const gopeno = Number((baseP + (isAutonomous ? 0.05 : 0.35)).toFixed(4));
      const lopenh = Number((baseP - 0.15).toFixed(4));
      const lopeno = Number((baseP + (isAutonomous ? 0.02 : 0.25)).toFixed(4));
      const obc = Number((baseP - 0.45).toFixed(4));
      const sc = Number((baseP - 5.2).toFixed(4));
      const st = Number((baseP - 15.5).toFixed(4));
      const tfws = Number((baseP + 0.18).toFixed(4));

      const packCat = (p) => {
        let finalP = p;
        if (finalP > 99.99) finalP = 99.99;
        if (finalP < 5.0) finalP = 5.0;
        return {
          percentile: finalP,
          rank: percentileToRank(finalP)
        };
      };

      return {
        GOPENH: packCat(gopenh),
        GOPENO: packCat(gopeno),
        LOPENH: packCat(lopenh),
        LOPENO: packCat(lopeno),
        OBC: packCat(obc),
        SC: packCat(sc),
        ST: packCat(st),
        TFWS: packCat(tfws)
      };
    };

    const branchCode = col.code + {
      "CS": "24510",
      "IT": "24610",
      "AIDS": "26310",
      "AIML": "26110",
      "ENTC": "37210",
      "EE": "29310",
      "ME": "61210",
      "CE": "19110",
      "CH": "50710"
    }[br.id];

    return {
      code: branchCode,
      name: br.name,
      intake: br.id === "CS" ? 120 : (br.id === "AIDS" || br.id === "AIML" ? 60 : 60),
      cutoffs2025: generateCategories(base2025),
      cutoffs2024: generateCategories(base2024)
    };
  });

  return {
    code: col.code,
    name: col.name,
    shortName: col.shortName,
    city: col.city,
    region: col.region,
    status: col.status,
    established: col.established,
    fees: col.fees,
    rating: col.rating,
    website: col.website,
    branches: branches
  };
});

// Format the typescript code
const tsCode = `// Generated colleges database with realistic MHT-CET previous years (2025 & 2024) cutoffs
export interface CategoryCutoff {
  percentile: number;
  rank: number;
}

export interface Branch {
  code: string;
  name: string;
  intake: number;
  cutoffs2025: {
    [category: string]: CategoryCutoff;
  };
  cutoffs2024: {
    [category: string]: CategoryCutoff;
  };
}

export interface College {
  code: string;
  name: string;
  shortName: string;
  city: string;
  region: string;
  status: string;
  established: number;
  fees: number;
  rating: number;
  website: string;
  branches: Branch[];
}

export const collegesData: College[] = ${JSON.stringify(colleges, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'colleges.ts'), tsCode);
console.log(`Successfully compiled colleges database. Generated ${colleges.length} colleges.`);
