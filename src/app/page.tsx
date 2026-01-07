'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Calendar, TrendingUp, Filter, Plus, X, ChevronDown, Search, ChevronLeft, ChevronRight, Share2, Download, MessageCircle, Send, Eye } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO, subWeeks, addWeeks } from 'date-fns';

interface LogEntry {
  id: string;
  date: string;
  day: number;
  treatmentName: string;
  commission: number;
  inputTime: string; // WIB time when entry was created
}

const treatments = [
  { name: 'Chair Refleksi 1 jam', commission: 30000 },
  { name: 'Chair Refleksi 1,5 jam', commission: 45000 },
  { name: 'Chair Refleksi 2 jam', commission: 60000 },
  { name: 'FB 1,5 jam', commission: 52500 },
  { name: 'FB 2 jam', commission: 67500 },
  { name: 'FB + Lulur 1,5 jam', commission: 67500 },
  { name: 'FB + Lulur 2 jam', commission: 82500 },
  { name: 'FB + Totok Wajah 1,5 jam', commission: 61500 },
  { name: 'FB + Totok Wajah 2 jam', commission: 76500 },
  { name: 'FB + Kerokan 1,5 jam', commission: 61500 },
  { name: 'FB + Kerokan 2 jam', commission: 76500 },
  { name: 'FB + Refleksi 1,5 jam', commission: 61500 },
  { name: 'FB + Refleksi 2 jam', commission: 76500 },
  { name: 'Sport Massage 1 jam', commission: 45000 },
  { name: 'Sport Massage 1,5 jam', commission: 58500 },
  { name: 'Prenatal 1,5 jam', commission: 67500 },
  { name: 'Prenatal 2 jam', commission: 76500 },
  { name: 'Prenatal + Lulur 1,5 jam', commission: 75000 },
  { name: 'Prenatal + Lulur 2 jam', commission: 93750 },
  { name: 'Post Natal 1 jam', commission: 52500 },
  { name: 'Pijat Laktasi 30 menit', commission: 45000 },
  { name: 'Bengkung 30 menit', commission: 37500 },
  { name: 'Post Natal Paket 2 jam', commission: 127500 },
  { name: 'Brazilian Lympatic 1 jam', commission: 157750 },
  { name: 'Brazilian Lympatic 1,5 jam', commission: 228750 },
  { name: 'Facial Lympatic 30 menit', commission: 52500 },
  { name: 'Manual Lympatic 1 jam', commission: 116250 },
  { name: 'Add on FB 30 menit', commission: 16500 },
  { name: 'Add on FB 1 jam', commission: 33500 },
  { name: 'Add on Lulur 30 menit', commission: 30000 },
  { name: 'Add on Totok Wajah 30 menit', commission: 24000 },
  { name: 'Add on Kerokan 30 menit', commission: 24000 },
  { name: 'Add on Refleksi FB 30 menit', commission: 24000 },
  { name: 'Add on Refleksi Chair 30 menit', commission: 18000 },
];

// Helper function to get current WIB time (GMT+7)
const getWIBTime = () => {
  const now = new Date();
  return new Date(now.getTime() + (7 * 60 * 60 * 1000) + (now.getTimezoneOffset() * 60 * 1000));
};

// Helper function to get current WIB time string
const getWIBTimeString = () => {
  const wibTime = getWIBTime();
  return wibTime.toLocaleTimeString('id-ID', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Helper function to get WIB date string for display
const getWIBDateString = () => {
  const wibTime = getWIBTime();
  return wibTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getDayOfWeek = (date: Date): number => {
  const day = date.getDay();
  return day === 0 ? 1 : day + 1; // Sunday = 1, Monday = 2, ..., Saturday = 7
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function LogbookKomisi() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [commission, setCommission] = useState<string>('');
  const [filterStart, setFilterStart] = useState<string>('');
  const [filterEnd, setFilterEnd] = useState<string>('');
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [isTreatmentPopupOpen, setIsTreatmentPopupOpen] = useState<boolean>(false);
  const [treatmentSearch, setTreatmentSearch] = useState<string>('');
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const [showShareMenu, setShowShareMenu] = useState<boolean>(false);
  const [showSharePreview, setShowSharePreview] = useState<boolean>(false);
  const [sharePreviewText, setSharePreviewText] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; treatmentName: string; date: string } | null>(null);
  const [dateUpdateTrigger, setDateUpdateTrigger] = useState<number>(0); // Trigger for re-renders
  const [maxDateWIB, setMaxDateWIB] = useState<string>(''); // Max date in WIB
  const [currentTimeWIB, setCurrentTimeWIB] = useState<string>(''); // Current WIB time
  const popupRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const sharePreviewRef = useRef<HTMLDivElement>(null);
  const lastDateRef = useRef<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const savedLogs = localStorage.getItem('komisiLogs');
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs);
      // Migrate existing logs to include inputTime if missing
      const migratedLogs = parsedLogs.map((log: any) => ({
        ...log,
        inputTime: log.inputTime || '-' // Set default value for existing logs
      }));
      setLogs(migratedLogs);
    }
  }, []);

  // ROBUST DATE MANAGEMENT SYSTEM - WIB TIME (GMT+7)
  useEffect(() => {
    const getCurrentDateString = () => {
      return getWIBTime().toISOString().split('T')[0];
    };

    const updateDateState = () => {
      const today = getCurrentDateString();
      const wibNow = getWIBTime();
      const yesterday = new Date(wibNow.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Update current time every second
      setCurrentTimeWIB(getWIBTimeString());
      
      // Check if date has changed from last check (using WIB time)
      if (lastDateRef.current !== today) {
        console.log('WIB Date changed from', lastDateRef.current, 'to', today);
        lastDateRef.current = today;
        setSelectedDate(today);
        setMaxDateWIB(today); // Update max date for input
        
        // Force component re-render to update week calculations
        setDateUpdateTrigger(prev => prev + 1);
        
        // Update date input attributes
        const dateInput = document.getElementById('date') as HTMLInputElement;
        if (dateInput) {
          dateInput.value = today;
          dateInput.max = today;
        }
      }
    };

    // Update immediately on mount
    updateDateState();

    // Check for date change every minute using WIB time
    const dateCheckInterval = setInterval(updateDateState, 60000);
    
    // Update time every second
    const timeUpdateInterval = setInterval(() => {
      setCurrentTimeWIB(getWIBTimeString());
    }, 1000);

    // Additional checks on page visibility change and focus
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateDateState();
        setCurrentTimeWIB(getWIBTimeString());
      }
    };

    const handleFocus = () => {
      updateDateState();
      setCurrentTimeWIB(getWIBTimeString());
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      clearInterval(dateCheckInterval);
      clearInterval(timeUpdateInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('komisiLogs', JSON.stringify(logs));
  }, [logs]);

  // Initialize date on component mount using WIB
  useEffect(() => {
    const todayWIB = getWIBTime().toISOString().split('T')[0];
    setSelectedDate(todayWIB);
    setMaxDateWIB(todayWIB);
    setCurrentTimeWIB(getWIBTimeString());
    lastDateRef.current = todayWIB;
  }, []);

  // Force re-render when date changes to update week calculations
  useEffect(() => {
    // This effect runs whenever dateUpdateTrigger changes
    // It ensures all week-related functions recalculate with the current date
    console.log('Date update trigger fired, re-rendering component');
  }, [dateUpdateTrigger]);

  useEffect(() => {
    if (selectedTreatment) {
      const treatment = treatments.find(t => t.name === selectedTreatment);
      if (treatment) {
        setCommission(treatment.commission.toString());
      }
    } else {
      setCommission('');
    }
  }, [selectedTreatment]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsTreatmentPopupOpen(false);
      }
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
      if (sharePreviewRef.current && !sharePreviewRef.current.contains(event.target as Node)) {
        setShowSharePreview(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredTreatments = treatments.filter(treatment =>
    treatment.name.toLowerCase().includes(treatmentSearch.toLowerCase())
  );

  const handleTreatmentSelect = (treatment: { name: string; commission: number }) => {
    setSelectedTreatment(treatment.name);
    setCommission(treatment.commission.toString());
    setIsTreatmentPopupOpen(false);
    setTreatmentSearch('');
  };

  const handlePopupClose = () => {
    setIsTreatmentPopupOpen(false);
    setTreatmentSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTreatment || !selectedDate || !commission) {
      return;
    }

    const dateObj = new Date(selectedDate);
    const inputTimeWIB = getWIBTimeString(); // Get current WIB time when submitting
    const newLog: LogEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      day: getDayOfWeek(dateObj),
      treatmentName: selectedTreatment,
      commission: parseInt(commission),
      inputTime: inputTimeWIB, // Add input time to log entry
    };

    setLogs([newLog, ...logs]);
    
    setSelectedTreatment('');
    setCommission('');
    // Keep selectedDate as today (don't reset)
  };

  const handleDelete = (id: string, treatmentName: string, date: string) => {
    setDeleteConfirm({ id, treatmentName, date });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setLogs(logs.filter(log => log.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const getWeeklyLogs = (weekOffset: number = 0): LogEntry[] => {
    // Always use current WIB date for calculations
    const wibNow = getWIBTime();
    const targetDate = weekOffset === 0 ? wibNow : addWeeks(wibNow, weekOffset);
    const weekStart = startOfWeek(targetDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(targetDate, { weekStartsOn: 0 });

    return logs.filter(log => {
      const logDate = parseISO(log.date);
      return isWithinInterval(logDate, { start: weekStart, end: weekEnd });
    });
  };

  const getWeeklyTotal = (weekOffset: number = 0): number => {
    return getWeeklyLogs(weekOffset).reduce((total, log) => total + log.commission, 0);
  };

  const getMostFrequentTreatment = (weekOffset: number = 0): string => {
    const weeklyLogs = getWeeklyLogs(weekOffset);
    if (weeklyLogs.length === 0) return '-';

    const treatmentCounts = weeklyLogs.reduce((acc, log) => {
      acc[log.treatmentName] = (acc[log.treatmentName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostFrequent = Object.entries(treatmentCounts).reduce((a, b) => 
      treatmentCounts[a[0]] > treatmentCounts[b[0]] ? a : b
    );

    return mostFrequent[0];
  };

  const getWeekDisplay = (weekOffset: number): string => {
    // Use current WIB date for week display
    const wibNow = getWIBTime();
    const targetDate = weekOffset === 0 ? wibNow : addWeeks(wibNow, weekOffset);
    const weekStart = startOfWeek(targetDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(targetDate, { weekStartsOn: 0 });

    if (weekOffset === 0) {
      return `Minggu Ini (${format(weekStart, 'dd MMM')} - ${format(weekEnd, 'dd MMM')})`;
    } else if (weekOffset === -1) {
      return `Minggu Lalu (${format(weekStart, 'dd MMM')} - ${format(weekEnd, 'dd MMM')})`;
    } else {
      return `${format(weekStart, 'dd MMM')} - ${format(weekEnd, 'dd MMM')}`;
    }
  };

  const applyFilter = () => {
    if (!filterStart && !filterEnd) {
      setFilteredLogs([]);
      return;
    }

    let filtered = logs;
    
    if (filterStart) {
      filtered = filtered.filter(log => log.date >= filterStart);
    }
    
    if (filterEnd) {
      filtered = filtered.filter(log => log.date <= filterEnd);
    }

    setFilteredLogs(filtered);
  };

  const getFilteredTotal = (): number => {
    return filteredLogs.reduce((total, log) => total + log.commission, 0);
  };

  const shareToWhatsApp = (data: LogEntry[]) => {
    const message = formatShareData(data);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowSharePreview(false);
  };

  const shareToTelegram = (data: LogEntry[]) => {
    const message = formatShareData(data);
    const telegramUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
    setShowSharePreview(false);
  };

  const copyToClipboard = (data: LogEntry[]) => {
    const message = formatShareData(data);
    navigator.clipboard.writeText(message);
    alert('Data berhasil disalin ke clipboard!');
    setShowSharePreview(false);
  };

  const exportToCSV = (data: LogEntry[]) => {
    const headers = ['Tanggal', 'Hari', 'Nama Treatment', 'Komisi'];
    const rows = data.map(log => [
      log.date,
      `Hari ke-${log.day}`,
      log.treatmentName,
      formatCurrency(log.commission)
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `laporan-komisi-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const formatShareData = (data: LogEntry[]): string => {
  if (data.length === 0) return 'No data to share';
  
  // Group data by date
  const groupedData = data.reduce((acc, log) => {
    const date = log.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, LogEntry[]>);

  // Get date range
  const sortedDates = Object.keys(groupedData).sort();
  const startDate = new Date(sortedDates[0] + 'T00:00:00');
  const endDate = new Date(sortedDates[sortedDates.length - 1] + 'T00:00:00');
  
  // Determine if it's current week, last week, or custom range
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
  const currentWeekEnd = endOfWeek(today, { weekStartsOn: 0 });
  const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 0 });
  const lastWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 0 });
  
  let reportTitle = '📊 *LAPORAN KOMISI*';
  let periodText = '';
  
  // Check if data is from last week
  if (sortedDates.length >= 5) {
    const dataStart = new Date(sortedDates[0] + 'T00:00:00');
    const dataEnd = new Date(sortedDates[sortedDates.length - 1] + 'T00:00:00');
    
    if (dataStart >= lastWeekStart && dataEnd <= lastWeekEnd) {
      reportTitle = '📊 *LAPORAN KOMISI MINGGU LALU*';
    }
  }
  
  // Format period text
  if (sortedDates.length === 1) {
    periodText = `📅 Periode: ${format(startDate, 'dd MMMM yyyy')}`;
  } else {
    periodText = `📅 Periode: ${format(startDate, 'dd MMMM yyyy')} - ${format(endDate, 'dd MMMM yyyy')}`;
  }
  
  // Calculate totals
  const grandTotal = data.reduce((sum, log) => sum + log.commission, 0);
  const totalTransactions = data.length;
  
  // Start building output
  let output = `${reportTitle}\n\n${periodText}\n\n💰 *Total Komisi: ${formatCurrency(grandTotal)}*\n📝 Jumlah Transaksi: ${totalTransactions}\n\n`;
  
  // Add transactions by date
  sortedDates.forEach((date) => {
    const dateObj = new Date(date + 'T00:00:00');
    const dayName = format(dateObj, 'EEEE');
    const formattedDate = format(dateObj, 'dd-MM-yyyy');
    
    // Add date header
    output += `📅 ${formattedDate} (${dayName})\n`;
    
    // Add transactions for this date
    groupedData[date].forEach((log, logIndex) => {
      // Format treatment name to uppercase and replace common variations
      let treatmentName = log.treatmentName.toUpperCase();
      
      // Replace common variations to match the example
      treatmentName = treatmentName
        .replace(/1 JAM/g, '60 MENIT')
        .replace(/1,5 JAM/g, '90 MENIT')
        .replace(/2 JAM/g, '2 JAM')
        .replace(/30 MENIT/g, '30 MENIT')
        .replace(/\s+/g, ' '); // Normalize spaces
      
      output += `${logIndex + 1}. ${treatmentName} : 💰 ${formatCurrency(log.commission)}\n`;
    });
    
    // Add empty line between dates (except last one)
    if (date !== sortedDates[sortedDates.length - 1]) {
      output += '\n';
    }
  });

  // Add copyright
  output += `\n© Developed by OREA 85 - ${format(new Date(), 'yyyy')}`;

  return output;
};

const openSharePreview = (data: LogEntry[]) => {
  const formattedText = formatShareData(data);
  setSharePreviewText(formattedText);
  setShowSharePreview(true);
  setShowShareMenu(false);
};

  useEffect(() => {
    if (filterStart || filterEnd) {
      applyFilter();
    } else {
      setFilteredLogs([]);
    }
  }, [filterStart, filterEnd]);

  // Body scroll prevention for mobile treatment popup and delete confirmation
  useEffect(() => {
    const body = document.body;
    
    if (isTreatmentPopupOpen || deleteConfirm || showSharePreview) {
      // Store current scroll position BEFORE applying fixed positioning
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Store in data attributes for restoration
      body.setAttribute('data-scroll-y', String(scrollY));
      body.setAttribute('data-scroll-x', String(scrollX));
      
      // Apply fixed positioning with OFFSET to maintain visual position
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.left = `-${scrollX}px`;
      body.style.width = '100%';
      body.style.height = '100%';
      body.style.overflow = 'hidden';
      
      console.log('Popup opened - applied fixed positioning with offset:', { scrollY, scrollX });
      
    } else {
      // Get stored scroll position
      const savedScrollY = body.getAttribute('data-scroll-y');
      const savedScrollX = body.getAttribute('data-scroll-x');
      
      if (savedScrollY !== null) {
        const scrollY = parseInt(savedScrollY);
        const scrollX = parseInt(savedScrollX || '0');
        
        console.log('Popup closed - restoring to exact position:', { scrollY, scrollX });
        
        // Remove fixed positioning FIRST
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.width = '';
        body.style.height = '';
        body.style.overflow = '';
        
        // Clear data attributes
        body.removeAttribute('data-scroll-y');
        body.removeAttribute('data-scroll-x');
        
        // IMMEDIATELY restore scroll position without animation
        window.scrollTo(scrollX, scrollY);
      }
    }
  }, [isTreatmentPopupOpen, deleteConfirm, showSharePreview]);

  // Calculate current week logs (will automatically use current date)
  const currentWeekLogs = getWeeklyLogs(currentWeekOffset);

  return (
    <div key={dateUpdateTrigger} className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        {/* Elegant Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-light tracking-tight text-amber-900">
            Logbook Komisi
          </h1>
          <p className="text-lg text-amber-700 font-light">
            Management system for treatment commissions
          </p>
          <p className="text-sm text-amber-600 font-light">
            Developed by OREA 85
          </p>
        </div>

        {/* Input Form - Luxury Minimalist */}
        <Card className="luxury-card">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-medium luxury-text flex items-center gap-3">
              <div className="icon-wrapper">
                <Plus className="w-4 h-4 text-amber-600" />
              </div>
              Add New Entry
            </CardTitle>
            {/* Digital Clock */}
            <div className="mt-4 text-center">
              <div className="text-3xl font-light text-amber-900 tracking-wider font-mono">
                {currentTimeWIB}
              </div>
              <div className="text-sm text-amber-600 font-light">
                {getWIBDateString()}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="treatment" className="text-sm font-medium text-amber-700">
                  Treatment Name
                </Label>
                <div className="relative" ref={popupRef}>
                  <button
                    type="button"
                    onClick={() => setIsTreatmentPopupOpen(!isTreatmentPopupOpen)}
                    className="w-full border-amber-200 bg-white text-amber-900 focus:border-amber-400 focus:ring-amber-400/20 rounded-lg px-3 py-2 text-left flex items-center justify-between hover:border-amber-300 transition-colors"
                  >
                    <span className={selectedTreatment ? 'text-amber-900' : 'text-amber-400'}>
                      {selectedTreatment || 'Select treatment'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${isTreatmentPopupOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isTreatmentPopupOpen && (
                    <>
                      {/* Mobile Backdrop */}
                      <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={handlePopupClose} />
                      
                      {/* Dropdown Content */}
                      <div className="treatment-dropdown-desktop popup-animation">
                        <div className="p-3 border-b border-amber-200 flex items-center justify-between">
                          <div className="relative flex-1 mr-3">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                            <input
                              type="text"
                              placeholder="Search treatments..."
                              value={treatmentSearch}
                              onChange={(e) => setTreatmentSearch(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                            />
                          </div>
                          <button
                            onClick={handlePopupClose}
                            className="p-2 hover:bg-amber-100 rounded-lg transition-colors md:hidden"
                          >
                            <X className="w-4 h-4 text-amber-400" />
                          </button>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredTreatments.length === 0 ? (
                            <div className="px-3 py-4 text-center text-amber-500 text-sm">
                              No treatments found
                            </div>
                          ) : (
                            filteredTreatments.map((treatment) => (
                              <button
                                key={treatment.name}
                                onClick={() => handleTreatmentSelect(treatment)}
                                className="treatment-dropdown-desktop-item w-full text-left"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-amber-900">
                                    {treatment.name}
                                  </span>
                                  <span className="text-xs text-amber-500">
                                    {formatCurrency(treatment.commission)}
                                  </span>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-zinc-700">
                  Date
                </Label>
                <Input
                  id="date"
                  key={selectedDate} // Force re-render when date changes
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                  }}
                  max={maxDateWIB}
                  className="border-zinc-200 bg-white text-zinc-900 focus:border-zinc-400 focus:ring-zinc-400/20 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission" className="text-sm font-medium text-zinc-700">
                  Commission
                </Label>
                <Input
                  id="commission"
                  type="text"
                  value={commission && commission !== '' ? formatCurrency(parseInt(commission)) : ''}
                  readOnly
                  className="border-zinc-200 bg-zinc-50 text-zinc-900 font-medium rounded-lg"
                />
              </div>

              <div className="flex items-end">
                <Button 
                  type="submit" 
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg transition-colors"
                >
                  Add Entry
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Stats Cards - Elegant Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-white/90 flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  Weekly Total
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      disabled={currentWeekOffset <= -4}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      disabled={currentWeekOffset >= 0}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light text-white">
                {formatCurrency(getWeeklyTotal(currentWeekOffset))}
              </div>
              <div className="text-sm text-white/60 mt-1">{getWeekDisplay(currentWeekOffset)}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-zinc-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-zinc-600" />
                </div>
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-light text-zinc-900">{currentWeekLogs.length}</div>
                  <div className="text-sm text-zinc-500">Total Entries</div>
                </div>
                <div>
                  <div className="text-lg font-light text-zinc-900 marquee-container">
                    <div className="marquee-content">
                      {getMostFrequentTreatment(currentWeekOffset)}
                    </div>
                  </div>
                  <div className="text-sm text-zinc-500">Most Frequent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Log Table - Clean Design */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-zinc-900 flex items-center justify-between">
              <span>Weekly Log - {getWeekDisplay(currentWeekOffset)}</span>
              <div className="relative" ref={shareMenuRef}>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => openSharePreview(currentWeekLogs)}
                  disabled={currentWeekLogs.length === 0}
                  className="relative overflow-hidden group border-2 border-zinc-300 bg-gradient-to-r from-zinc-50 to-zinc-100 hover:from-zinc-100 hover:to-zinc-200 text-zinc-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    <Share2 className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10">Share Data</span>
                    <div className="absolute -top-1 -right-1">
                      <div className="flex space-y-1">
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-100">
                    <TableHead className="text-zinc-700 font-medium">Date</TableHead>
                    <TableHead className="text-zinc-700 font-medium">Day</TableHead>
                    <TableHead className="text-zinc-700 font-medium">Treatment</TableHead>
                    <TableHead className="text-zinc-700 font-medium text-right">Commission</TableHead>
                    <TableHead className="text-zinc-700 font-medium text-center">Waktu Input</TableHead>
                    <TableHead className="text-zinc-700 font-medium text-center w-20">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentWeekLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-zinc-400 py-12">
                        <div className="space-y-2">
                          <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                            <Calendar className="w-6 h-6 text-zinc-400" />
                          </div>
                          <p className="text-zinc-500">No entries this week</p>
                          <p className="text-sm text-zinc-400">Add your first commission entry</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentWeekLogs.map((log) => (
                      <TableRow key={log.id} className="border-zinc-100 hover:bg-zinc-50 transition-colors">
                        <TableCell className="text-zinc-900 font-medium">{log.date}</TableCell>
                        <TableCell className="text-zinc-600">Day {log.day}</TableCell>
                        <TableCell className="text-zinc-900">{log.treatmentName}</TableCell>
                        <TableCell className="text-zinc-900 text-right font-medium">
                          {formatCurrency(log.commission)}
                        </TableCell>
                        <TableCell className="text-zinc-600 text-center font-mono text-sm">
                          {log.inputTime || '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(log.id, log.treatmentName, log.date)}
                            className="text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Filter Section - Minimalist Design */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-6">
            <CardTitle className="text-lg font-medium text-zinc-900 flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                <Filter className="w-4 h-4 text-zinc-600" />
              </div>
              Filter & Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filterStart" className="text-sm font-medium text-zinc-700">
                  Start Date
                </Label>
                <Input
                  id="filterStart"
                  type="date"
                  value={filterStart}
                  onChange={(e) => setFilterStart(e.target.value)}
                  className="border-zinc-200 bg-white text-zinc-900 focus:border-zinc-400 focus:ring-zinc-400/20 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filterEnd" className="text-sm font-medium text-zinc-700">
                  End Date
                </Label>
                <Input
                  id="filterEnd"
                  type="date"
                  value={filterEnd}
                  onChange={(e) => setFilterEnd(e.target.value)}
                  className="border-zinc-200 bg-white text-zinc-900 focus:border-zinc-400 focus:ring-zinc-400/20 rounded-lg"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button 
                  onClick={applyFilter}
                  disabled={!filterStart && !filterEnd}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Filter
                </Button>
                <Button 
                  onClick={() => {
                    setFilterStart('');
                    setFilterEnd('');
                    setFilteredLogs([]);
                  }}
                  variant="outline"
                  className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-lg"
                >
                  Reset
                </Button>
              </div>
            </div>

            {filteredLogs.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-100">
                        <TableHead className="text-zinc-700 font-medium">Date</TableHead>
                        <TableHead className="text-zinc-700 font-medium">Day</TableHead>
                        <TableHead className="text-zinc-700 font-medium">Treatment</TableHead>
                        <TableHead className="text-zinc-700 font-medium text-right">Commission</TableHead>
                        <TableHead className="text-zinc-700 font-medium text-center">Waktu Input</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <TableRow key={log.id} className="border-zinc-100 hover:bg-zinc-50 transition-colors">
                          <TableCell className="text-zinc-900 font-medium">{log.date}</TableCell>
                          <TableCell className="text-zinc-600">Day {log.day}</TableCell>
                          <TableCell className="text-zinc-900">{log.treatmentName}</TableCell>
                          <TableCell className="text-zinc-900 text-right font-medium">
                            {formatCurrency(log.commission)}
                          </TableCell>
                          <TableCell className="text-zinc-600 text-center font-mono text-sm">
                            {log.inputTime || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="pt-6 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-zinc-500">Total Commission</div>
                      <div className="text-2xl font-light text-zinc-900">
                        {formatCurrency(getFilteredTotal())}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zinc-500">
                        {filteredLogs.length} entries
                      </div>
                      <div className="text-sm text-zinc-400">
                        {filterStart && filterEnd ? `${filterStart} - ${filterEnd}` : filterStart || filterEnd || 'All time'}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {filteredLogs.length === 0 && (filterStart || filterEnd) && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-6 h-6 text-zinc-400" />
                </div>
                <p className="text-zinc-500">No data found for selected date range</p>
                <p className="text-sm text-zinc-400">Try adjusting your filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Share Preview Modal with Backdrop */}
        {showSharePreview && (
          <>
            <div className="share-popup-with-backdrop" onClick={() => setShowSharePreview(false)}>
              <div className="share-popup-container" onClick={(e) => e.stopPropagation()}>
                <div className="share-popup-header">
                  <h3 className="share-popup-title">Preview Share Data</h3>
                  <button
                    onClick={() => setShowSharePreview(false)}
                    className="share-popup-close"
                  >
                    ×
                  </button>
                </div>
                
                <div className="share-popup-content">
                  <div className="share-popup-text">
                    {sharePreviewText}
                  </div>
                </div>

                <div className="share-popup-footer">
                  <button
                    onClick={() => shareToWhatsApp(currentWeekLogs)}
                    className="share-popup-button share-popup-whatsapp"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => shareToTelegram(currentWeekLogs)}
                    className="share-popup-button share-popup-telegram"
                  >
                    <Send className="w-5 h-5" />
                    Telegram
                  </button>
                  <button
                    onClick={() => copyToClipboard(currentWeekLogs)}
                    className="share-popup-button share-popup-copy"
                  >
                    <Download className="w-5 h-5" />
                    Copy
                  </button>
                  <button
                    onClick={() => exportToCSV(currentWeekLogs)}
                    className="share-popup-button share-popup-export"
                  >
                    <Download className="w-5 h-5" />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Delete Confirmation Popup */}
        {deleteConfirm && (
          <>
            <div className="delete-confirm-backdrop prevent-scroll-jump" onClick={cancelDelete}>
              <div className="delete-confirm-container prevent-scroll-jump" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="delete-confirm-header">
                  <div className="flex items-center gap-4">
                    <div className="delete-icon-wrapper">
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900">Konfirmasi Hapus</h3>
                      <p className="text-sm text-zinc-500">Tindakan ini tidak dapat dibatalkan</p>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="delete-confirm-content">
                  <p className="text-zinc-700 mb-4">
                    Apakah Anda yakin ingin menghapus log treatment ini?
                  </p>
                  <div className="treatment-info-box">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-zinc-600">Tanggal:</span>
                        <span className="text-sm font-semibold text-zinc-900">
                          {deleteConfirm.date}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-zinc-600">Treatment:</span>
                        <span className="text-sm font-semibold text-zinc-900">
                          {deleteConfirm.treatmentName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="delete-confirm-footer">
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={cancelDelete}
                      className="delete-confirm-button delete-confirm-cancel"
                    >
                      Batal
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="delete-confirm-button delete-confirm-delete"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Footer Copyright */}
        <div className="text-center py-6 border-t border-amber-200">
          <div className="space-y-3">
            <p className="text-sm text-amber-400 font-light">
              © Developed by OREA 85 - {format(new Date(), 'yyyy')} | All rights reserved
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-amber-600 font-bold uppercase tracking-wider">
                JANGAN LUPA FOLLOW INSTAGRAM
              </p>
              <a
                href="https://www.instagram.com/orea_85?igsh=MXdxcjZqeGN1dnFndw=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                </svg>
                OREA_85
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}