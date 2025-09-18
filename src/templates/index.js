// Template definitions for quick starters
export const templates = {
  website: {
    id: 'website',
    name: 'موقع ويب احترافي',
    type: 'website',
    description: 'موقع ويب متكامل بصفحات متعددة',
    time: '5 دقائق',
    components: [
      {
        type: 'header',
        props: { 
          title: 'موقع الشركة', 
          subtitle: 'نحن نقدم أفضل الخدمات' 
        }
      },
      {
        type: 'hero',
        props: { 
          title: 'مرحباً بك في موقعنا الإلكتروني', 
          description: 'نقدم حلول متميزة لعملائنا الكرام',
          buttonText: 'اكتشف المزيد'
        }
      },
      {
        type: 'text',
        props: {
          title: 'من نحن',
          content: 'نحن فريق من الخبراء المتخصصين في تقديم أفضل الخدمات والحلول المبتكرة.'
        }
      }
    ]
  },
  
  mobile: {
    id: 'mobile',
    name: 'تطبيق موبايل',
    type: 'mobile-app',
    description: 'تطبيق متجاوب للهواتف والأجهزة اللوحية',
    time: '10 دقائق',
    components: [
      {
        type: 'header',
        props: { 
          title: 'تطبيقي الذكي', 
          subtitle: 'في راحة يدك' 
        }
      },
      {
        type: 'hero',
        props: { 
          title: 'تطبيق سهل وذكي', 
          description: 'كل ما تحتاجه في مكان واحد',
          buttonText: 'حمل الآن'
        }
      }
    ]
  },
  
  dashboard: {
    id: 'dashboard',
    name: 'لوحة تحكم',
    type: 'dashboard',
    description: 'لوحة إدارة مع مخططات وتقارير',
    time: '8 دقائق',
    components: [
      {
        type: 'header',
        props: { 
          title: 'لوحة التحكم', 
          subtitle: 'إدارة شاملة' 
        }
      },
      {
        type: 'hero',
        props: { 
          title: 'مرحباً بك في لوحة التحكم', 
          description: 'تحكم كامل في نظامك من مكان واحد',
          buttonText: 'ابدأ الإدارة'
        }
      }
    ]
  },
  
  landing: {
    id: 'landing',
    name: 'صفحة هبوط',
    type: 'landing-page',
    description: 'صفحة تسويقية لمنتج أو خدمة',
    time: '3 دقائق',
    components: [
      {
        type: 'hero',
        props: { 
          title: 'المنتج الثوري الجديد', 
          description: 'احصل على حل مبتكر يغير طريقة عملك',
          buttonText: 'احصل عليه الآن'
        }
      },
      {
        type: 'text',
        props: {
          title: 'لماذا نحن مختلفون؟',
          content: 'نقدم حلول فريدة ومبتكرة تلبي احتياجاتك بدقة وجودة عالية.'
        }
      }
    ]
  }
};

export const getTemplate = (id) => templates[id];
export const getAllTemplates = () => Object.values(templates);