import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Search, Star, Trophy, GraduationCap, CheckCircle } from 'lucide-react'
import studentsData from './assets/students_data.json'
import './App.css'

// مكون تأثيرات الاحتفال
const CelebrationEffects = () => {
  const [confetti, setConfetti] = useState([])
  const [fireworks, setFireworks] = useState([])

  useEffect(() => {
    // إنشاء قطع الكونفيتي
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'][Math.floor(Math.random() * 5)]
    }))
    setConfetti(confettiPieces)

    // إنشاء الألعاب النارية
    const fireworksArray = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'][Math.floor(Math.random() * 5)]
    }))
    setFireworks(fireworksArray)
  }, [])

  return (
    <div className="celebration">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            backgroundColor: piece.color
          }}
        />
      ))}
      {fireworks.map((firework) => (
        <div
          key={firework.id}
          className="fireworks"
          style={{
            left: `${firework.left}%`,
            top: `${firework.top}%`,
            animationDelay: `${firework.delay}s`,
            backgroundColor: firework.color
          }}
        />
      ))}
    </div>
  )
}

function App() {
  const [examNumber, setExamNumber] = useState('')
  const [student, setStudent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)
  const [telegramVerified, setTelegramVerified] = useState(false)

  // محاكاة التحقق من الاشتراك في تيليجرام
  const verifyTelegramSubscription = async (examNum) => {
    setIsLoading(true)
    setError('')
    
    // محاكاة استدعاء API للتحقق من الاشتراك
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // في التطبيق الحقيقي، سيتم التحقق من الاشتراك عبر Telegram Bot API
      // هنا سنفترض أن التحقق نجح
      setTelegramVerified(true)
      return true
    } catch (err) {
      setError('فشل في التحقق من الاشتراك في القناة')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const searchStudent = async () => {
    if (!examNumber.trim()) {
      setError('يرجى إدخال الرقم الامتحاني')
      return
    }

    // التحقق من الاشتراك في تيليجرام أولاً
    const isSubscribed = await verifyTelegramSubscription(examNumber)
    if (!isSubscribed) {
      return
    }

    // البحث عن الطالب
    const foundStudent = studentsData.find(s => s['الرقم الامتحاني'].toString() === examNumber.trim())
    
    if (foundStudent) {
      setStudent(foundStudent)
      setShowCelebration(true)
      setError('')
      
      // إخفاء تأثيرات الاحتفال بعد 5 ثوان
      setTimeout(() => {
        setShowCelebration(false)
      }, 5000)
    } else {
      setError('لم يتم العثور على الرقم الامتحاني')
      setStudent(null)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchStudent()
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4">
      {showCelebration && <CelebrationEffects />}
      
      <div className="w-full max-w-2xl space-y-8">
        {/* العنوان الرئيسي */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 space-x-reverse">
            <GraduationCap className="h-12 w-12 text-white" />
            <h1 className="text-4xl font-bold text-white">نتائج الطلاب</h1>
          </div>
          <p className="text-xl text-white/80">العراق - نتائج الامتحانات الرسمية</p>
        </div>

        {/* نموذج البحث */}
        <Card className="backdrop-blur-sm bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-white flex items-center justify-center gap-2">
              <Search className="h-6 w-6" />
              البحث عن النتيجة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-white font-medium">الرقم الامتحاني</label>
              <Input
                type="text"
                placeholder="أدخل الرقم الامتحاني..."
                value={examNumber}
                onChange={(e) => setExamNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-right bg-white/20 border-white/30 text-white placeholder:text-white/60"
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="text-red-300 text-center bg-red-500/20 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button 
              onClick={searchStudent}
              disabled={isLoading || !examNumber.trim()}
              className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              {isLoading ? 'جاري التحقق...' : 'البحث عن النتيجة'}
            </Button>

            <div className="text-center text-white/70 text-sm">
              <p>يجب الاشتراك في قناة تيليجرام للحصول على النتيجة</p>
              <a 
                href="https://t.me/dveIQ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 underline"
              >
                @dveIQ
              </a>
            </div>
          </CardContent>
        </Card>

        {/* عرض النتيجة */}
        {student && telegramVerified && (
          <Card className="result-card text-white border-0 pulse-success">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2 space-x-reverse mb-4">
                <Trophy className="h-8 w-8 text-yellow-300" />
                <CardTitle className="text-2xl">مبروك! أنت من الأوائل على العراق</CardTitle>
                <Trophy className="h-8 w-8 text-yellow-300" />
              </div>
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <CheckCircle className="h-6 w-6 text-green-300" />
                <span className="text-green-300">تم التحقق من الاشتراك بنجاح</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white/20 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-300" />
                      اسم الطالب
                    </h3>
                    <p className="text-lg">{student['اسم الطالب الرباعي']}</p>
                  </div>
                  
                  <div className="bg-white/20 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">الرقم الامتحاني</h3>
                    <p className="text-lg font-mono">{student['الرقم الامتحاني']}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/20 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-300" />
                      المعدل
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-yellow-300">
                        {student['المعدل'].toFixed(2)}
                      </span>
                      <Badge variant="secondary" className="bg-yellow-300 text-yellow-900">
                        ممتاز
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">القسم</h3>
                    <p className="text-lg">{student['القسم']}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/20 p-4 rounded-lg text-center">
                <h3 className="font-semibold mb-2 flex items-center justify-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-300" />
                  التسلسل
                </h3>
                <span className="text-2xl font-bold text-yellow-300">
                  المرتبة #{student['التسلسل']}
                </span>
              </div>

              <div className="text-center bg-gradient-to-r from-yellow-400/20 to-orange-400/20 p-4 rounded-lg">
                <p className="text-xl font-bold text-yellow-300">
                  🎉 تهانينا! لقد حققت نتيجة متميزة 🎉
                </p>
                <p className="text-white/80 mt-2">
                  نتمنى لك التوفيق في مسيرتك التعليمية
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* تذييل الصفحة */}
      <div className="mt-8 text-center text-white/60">
        <p>© 2024 نظام نتائج الطلاب - العراق</p>
      </div>
    </div>
  )
}

export default App

