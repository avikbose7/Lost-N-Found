

const Icon = ({ children, className, ...props }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{children}</svg>;
const TwitterIcon = (props) => <Icon {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 4.4s-1.4-.6-2.8-.9c-1.2 2.2-2.8 4-4.2 4.6-2 .9-5.2.2-6.6-2.3s-1.4-5.2 0-7.1c1.4-1.9 4.1-3.2 6.3-3.2s4.1 1.2 4.1 1.2z"/></Icon>;
const InstagramIcon = (props) => <Icon {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></Icon>;
const FacebookIcon = (props) => <Icon {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></Icon>;


function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-slate-500 text-center md:text-left">
            &copy; {currentYear} Lost & Found Platform. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a href="#" aria-label="Twitter" className="text-slate-500 hover:text-slate-800 transition-colors"><TwitterIcon className="w-6 h-6" /></a>
            <a href="#" aria-label="Facebook" className="text-slate-500 hover:text-slate-800 transition-colors"><FacebookIcon className="w-6 h-6" /></a>
            <a href="#" aria-label="Instagram" className="text-slate-500 hover:text-slate-800 transition-colors"><InstagramIcon className="w-6 h-6" /></a>
          </div>
        </div>
        <div className="text-center text-xs text-slate-400 mt-6 border-t pt-6">
            Made with ❤️ in Kolkata, India.
        </div>
      </div>
    </footer>
  );
}
export default Footer;